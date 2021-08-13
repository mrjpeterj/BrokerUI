import * as ioBroker from 'types/iobroker';

export class BrokerHelpers {
    public static GetString(label: ioBroker.StringOrTranslated | null): string {
        if (typeof (label) === 'string') {
            return label as string;
        } else if (label != null) {
            return label.en || '';
        }
        else
        {
            return "";
        }
    }
}
