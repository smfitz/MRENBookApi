import { gql } from "@apollo/client";

export const GET_MOI = gql`
{
    moi {
        _id
        username
        email
        savedBooks {
            title
            bookId
            authors
            description
            image
        }
    }
}
`;