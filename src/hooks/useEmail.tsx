import { DateTime } from "luxon";
import { useContext, useState } from "react";
import { IPerson, IProcess } from "../api/DomainObjects";
import { EmailApiConfig } from "../api/EmailApi";
import { ErrorsContext } from "../providers/ErrorsContext";

export interface IEmailSender {
    sending: boolean,
    sendEmail: (to: IPerson[], subject: string, body: string, cc?: IPerson[], from?: IPerson) => Promise<void>,
    sendSubmitEmail: (process: IProcess) => Promise<void>,
}

export function useEmail(): IEmailSender {

    const [sending, setSending] = useState<boolean>(false);

    const errorsContext = useContext(ErrorsContext);

    const emailApi = EmailApiConfig.getApi();

    const sendEmail = async (to: IPerson[], subject: string, body: string, cc?: IPerson[], from?: IPerson): Promise<void> => {
        try {
            setSending(true);
            if (to.length) {
                await emailApi.sendEmail(to, subject, body, cc, from);
            }
        } catch (e) {
            if (errorsContext.reportError) {
                errorsContext.reportError(e);
            }
        } finally {
            setSending(false);
        }
    }

    const sendSubmitEmail = async (process: IProcess): Promise<void> => {
        let to = [process.Buyer];
        let subject = `Procurement RFP Number: ${process.SolicitationNumber} has been assigned to you`;
        let body = `Procurement RFP # ${process.SolicitationNumber} has been assigned to you for Buyer Review on ${process.Modified.toLocaleString(DateTime.DATETIME_MED)}.

        When you are done, Send to CO Initial Review.
        
        
        Link to procurement: ${emailApi.siteUrl}/app/index.aspx#/Processes/View/${process.Id}
        
        Record will only be available for 90 days.`;

        return sendEmail(to, subject, body);
    }

    return {
        sending,
        sendEmail,
        sendSubmitEmail
    }
}