import { gql } from '@apollo/client';

export const GET_ME = gql`
  query me {
    me {
      _id
      username
      email
      bookCount
      savedBooks {
        bookId
        authors
        description
        title
        image
        link
      }
    }
  }
`;

export const SEARCH_BOOKS = gql`
  query SearchBooks($title: String!) {
    searchBooks(title: $title) {
      bookId
      authors
      title
      description
      image
    }
  }
`;
