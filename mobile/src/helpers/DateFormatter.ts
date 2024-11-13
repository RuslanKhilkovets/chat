class DateFormatter {
  /**
   * Formats a date to "YYYY-MM-DD HH:mm:ss" format.
   * @param date - The date to be formatted.
   * @returns A string representing the formatted date.
   */
  static formatDateTime(date: Date | undefined): string | null {
    if (!date) return null;

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  }

  /**
   * Formats a date to a localized string with or without the year.
   * @param date - The date to be formatted.
   * @param withYear - Whether to include the year in the formatted string.
   * @returns A localized date string.
   */
  static formatLocalizedDate(
    date: Date | undefined | null,
    withYear: boolean = false,
  ): string | null {
    if (!date || !(date instanceof Date)) return null;

    return date.toLocaleDateString('uk-UA', {
      day: 'numeric',
      month: 'long',
      ...(withYear && {year: 'numeric'}),
    });
  }
  /**
   *
   * @param dateString - The date string
   * @returns An ISO8601 date string representing
   */
  static convertToIso8601(
    dateString: string | null | undefined,
  ): string | null {
    if (!dateString) return null;

    const date = new Date(dateString);
    return date.toISOString();
  }
}

export default DateFormatter;
