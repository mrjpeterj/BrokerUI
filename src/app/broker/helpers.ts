import * as ioBroker from 'types/iobroker';

export class BrokerHelpers {
    public static GetString(label: ioBroker.StringOrTranslated): string {
        let actualName: string;
        if (typeof (label) === 'string') {
            actualName = label as string;
        } else {
            actualName = label.en || '';
        }

        return actualName;
    }
}
