import { compareSync, genSaltSync, hashSync } from "bcrypt";
import { redis } from "../../config/redis.conf.js";
import { randomOTPGenerator } from "./random.js"
import transporter from "../../config/smtp.conf.js";
import { HTML, HTTP_STATUS, OTP_CONF, SMTP, subjects } from "../../config/constants.conf.js";
import { sendError, sendSuccess } from "../errorHandler.util.js";
import { formatFullDuration } from "../timeFormat.util.js";

export const otpGenerator = async ({ _id, email, firstName, lastName }, statusType) => {
    const otp = randomOTPGenerator();
    const hashedOTP = hashSync(otp, genSaltSync(10));

    const html = await HTML(statusType, firstName, lastName, otp)
    const mailOptions = {
        from: SMTP.USER,
        to: email,
        subject: subjects[statusType],
        html,
    };
    const limits = await redis.get(`otp:${statusType}:limit:${_id}`);
    let times = limits > 5 && limits <= 20 ? limits * 5 : limits > 20 && limits <= 40 ? limits * 20 : limits > 40 && limits < 50 ? limits * 50 : limits >= 50 ? false : 1;
    if (!times)
        return false;
    await transporter.sendMail(mailOptions);
    await redis.set(`otp:${statusType}:value:${_id}`, hashedOTP, 'EX', OTP_CONF.OTP_TTL_SECONDS);
    await redis.set(`otp:${statusType}:expire:${_id}`, '1', 'EX', OTP_CONF.COOL_DOWN_SECONDS * times)
    await redis.incr(`otp:${statusType}:limit:${_id}`);
    return true;
};

export const destroyEmailOTP = async (statusType, _id) => {
    await redis.del(`otp:${statusType}:value:${_id}`);
    await redis.del(`otp:${statusType}:expire:${_id}`);
    await redis.del(`otp:${statusType}:limit:${_id}`);
};

export const limitOtp = async (user, statusType, res) => {
    const waitTime = await redis.ttl(`otp:${statusType}:expire:${user._id}`);
    if (waitTime !== -2) {
        sendError(
            res,
            `Too many request attempts, try again after ${formatFullDuration(waitTime)}`,
            'WAITING_LIMIT',
            HTTP_STATUS.LIMIT_REQUESTS,
            'You have exceeded the allowed otp requests.'
        );
        return false;
    };
    return true
};

export const sendingOTP = async (user, {pre, sub}, res) => {
    const limitOTP = await limitOtp(user, sub, res);
    if (!limitOTP) return;
    const otpGen = await otpGenerator(user, sub);
    await redis.del(`otp:${pre}:limit:${user._id}`);
    if (!otpGen)
        return sendError(
            res,
            'Your account has been banned. Contact support for more information.',
            'ACCOUNT_BANNED',
            HTTP_STATUS.FORBIDDEN,
            'Account has been banned for more requests.'
        );
    sendSuccess(
        res,
        'OTP sent successfully.',
        undefined,
        HTTP_STATUS.OK
    );
};

export const limitOtpTrying = async ({ pre, sub }, user, res, otp) => {
    const verifiedLimit = await redis.get(`otp:${pre}:limit:${user._id}`);
    const hashedOTP = await redis.get(`otp:${sub}:value:${user._id}`);
    console.log(hashedOTP)
    if (verifiedLimit > 5 || !hashedOTP) {
        await redis.del(`otp:${sub}:value:${user._id}`);
        sendError(
            res,
            'Your OTP expired, send new one.',
            'OTP_EXPIRED',
            HTTP_STATUS.BAD_REQUEST,
            'OTP have expired or exceeded otp limit'
        );
        return false;
    }

    const matchOTP = compareSync(otp, hashedOTP)
    await redis.incr(`otp:${pre}:limit:${user._id}`);
    if (!matchOTP){
        sendError(
            res,
            `OTP not correct.`,
            'FAILED_OTP',
            HTTP_STATUS.BAD_REQUEST,
            'You enter incorrect otp check it in the email and enter it again',
        );
        return false;
    };
    return true
}