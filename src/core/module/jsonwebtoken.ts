import jwt from 'jsonwebtoken';
import Common from '@core/system/common';
import Logger from '@core/system/logger';

export default class OryxJWT {
    private static secretKey: string = Common.env<string>(
        'JWT_SECRET_KEY',
        'oryx123456789',
    );
    private static expiresIn: number = Common.env<number>(
        'JWT_EXPIRE_IN',
        86400,
    );

    /**
     * Generate a JWT token
     * @param payload Optional payload (default: empty object)
     * @returns Generated JWT token
     */
    public static generate(
        payload: string | object | any[] = {},
    ): string | null {
        try {
            const formattedPayload =
                typeof payload === 'string' || Array.isArray(payload)
                    ? { data: payload }
                    : payload;

            return jwt.sign(formattedPayload, this.secretKey, {
                expiresIn: this.expiresIn,
            });
        } catch (error: any) {
            Logger.warn(`JWT Generation Failed: ${error.message}`);
            return null;
        }
    }

    /**
     * Verify and decode a JWT token
     * @param token JWT token
     * @returns Decoded payload or null if invalid
     */
    public static verify<T = any>(token: string): T | null {
        try {
            return jwt.verify(token, this.secretKey) as T;
        } catch (error: any) {
            Logger.warn(`JWT Verification Failed: ${error.message}`);
            return null;
        }
    }
}
