import Common from '@core/system/common';

export default class OryxDate {
    private static defaultTimezone = Common.env('APP_TIMEZONE', 'UTC');
    private static locale = Intl.DateTimeFormat().resolvedOptions().locale;

    private date: Date;

    private constructor(date?: Date | string | number) {
        this.date = date ? new Date(date) : new Date();
    }

    public static setTimezone(timezone: string) {
        this.defaultTimezone = timezone;
    }

    public static now(date?: Date | string | number): OryxDate {
        return new OryxDate(date);
    }

    public toString(format: Intl.DateTimeFormatOptions = {}): string {
        return this.date.toLocaleString(OryxDate.locale, {
            timeZone: OryxDate.defaultTimezone,
            ...format,
        });
    }

    public format(fmt: string = 'YYYY-MM-DD HH:mm:ss'): string {
        const pad = (num: number) => String(num).padStart(2, '0');

        const options: Intl.DateTimeFormatOptions = {
            timeZone: OryxDate.defaultTimezone,
            weekday: 'long',
            month: 'long',
            day: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12:
                fmt.includes('hh') || fmt.includes('A') || fmt.includes('a'),
        };

        const formatter = new Intl.DateTimeFormat(OryxDate.locale, options);
        const parts = formatter.formatToParts(this.date);
        const partMap = Object.fromEntries(parts.map((p) => [p.type, p.value]));

        const hour24 = pad(this.date.getHours());
        const hour12 = pad(Number(partMap.hour));
        const ampm =
            partMap.dayPeriod || (this.date.getHours() >= 12 ? 'PM' : 'AM');

        const map: { [key: string]: string } = {
            YYYY: partMap.year,
            MM: pad(this.date.getMonth() + 1),
            MMM: partMap.month.substring(0, 3),
            MMMM: partMap.month,
            DD: partMap.day,
            ddd: partMap.weekday.substring(0, 3),
            dddd: partMap.weekday,
            HH: hour24,
            hh: hour12,
            mm: partMap.minute,
            ss: partMap.second,
            A: ampm.toUpperCase(),
            a: ampm.toLowerCase(),
            ZZ: `GMT${-this.date.getTimezoneOffset() / 60}`,
        };

        return fmt.replace(
            /YYYY|MM|MMM|MMMM|DD|ddd|dddd|HH|hh|mm|ss|A|a|ZZ/g,
            (match) => map[match],
        );
    }

    public add(
        amount: number,
        unit: 'days' | 'hours' | 'minutes' | 'seconds',
    ): this {
        if (unit === 'days') this.date.setDate(this.date.getDate() + amount);
        if (unit === 'hours') this.date.setHours(this.date.getHours() + amount);
        if (unit === 'minutes')
            this.date.setMinutes(this.date.getMinutes() + amount);
        if (unit === 'seconds')
            this.date.setSeconds(this.date.getSeconds() + amount);
        return this;
    }

    public subtract(
        amount: number,
        unit: 'days' | 'hours' | 'minutes' | 'seconds',
    ): this {
        return this.add(-amount, unit);
    }

    public toUnix(): number {
        return Math.floor(this.date.getTime() / 1000);
    }

    public isValid(): boolean {
        return !isNaN(this.date.getTime());
    }

    public isLeapYear(): boolean {
        const year = this.date.getFullYear();
        return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
    }

    /** 🆕 Additional Features */
    public toISO(): string {
        return this.date.toISOString();
    }

    public toUTC(): string {
        return this.date.toUTCString();
    }

    public toTimezone(timezone: string): string {
        return this.date.toLocaleString(OryxDate.locale, {
            timeZone: timezone,
        });
    }

    public diff(
        date: OryxDate,
        unit: 'days' | 'hours' | 'minutes' | 'seconds',
    ): number {
        const diffMs = this.date.getTime() - date.date.getTime();
        const conversions = {
            days: 86400000,
            hours: 3600000,
            minutes: 60000,
            seconds: 1000,
        };
        return Math.floor(diffMs / conversions[unit]);
    }

    public isBefore(date: OryxDate): boolean {
        return this.date.getTime() < date.date.getTime();
    }

    public isAfter(date: OryxDate): boolean {
        return this.date.getTime() > date.date.getTime();
    }

    public isSame(date: OryxDate): boolean {
        return this.date.getTime() === date.date.getTime();
    }

    public toRelative(): string {
        const now = new Date();
        const diffMs = now.getTime() - this.date.getTime();
        const seconds = Math.floor(diffMs / 1000);

        if (seconds < 60) return `${seconds} seconds ago`;
        const minutes = Math.floor(seconds / 60);
        if (minutes < 60) return `${minutes} minutes ago`;
        const hours = Math.floor(minutes / 60);
        if (hours < 24) return `${hours} hours ago`;
        const days = Math.floor(hours / 24);
        return `${days} days ago`;
    }
}
