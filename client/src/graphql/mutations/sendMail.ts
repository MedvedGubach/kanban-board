import { gql } from "@apollo/client";

export const SEND_EMAIL = gql`
  mutation SendEmail($to: String!, $subject: String!, $text: String!) {
    sendEmail(to: $to, subject: $subject, text: $text)
  }
`;