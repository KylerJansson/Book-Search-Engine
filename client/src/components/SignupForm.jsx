import { useState } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';
import { useMutation } from '@apollo/client';
import { ADD_USER } from '../utils/mutations';
import Auth from '../utils/auth';

const SignupForm = () => {
  // set initial form state
  const [userFormData, setUserFormData] = useState({ username: '', email: '', password: '' });
  // set state for alert
  const [showAlert, setShowAlert] = useState(false);

  const [addUser, { error }] = useMutation(ADD_USER, {
    onCompleted: (data) => {
      Auth.login(data.addUser.token);
    }
  });

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setUserFormData({ ...userFormData, [name]: value });
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();

    try {
      await addUser({
        variables: { ...userFormData },
      });
    } catch (e) {
      console.error('Signup error', e);
      setShowAlert(true);
    }
  };

  return (
    <>
      <Form noValidate onSubmit={handleFormSubmit}>
        {showAlert && (
          <Alert dismissible onClose={() => setShowAlert(false)} show={showAlert} variant='danger'>
            {error ? error.message : 'Something went wrong with your signup!'}
          </Alert>
        )}
        <Form.Group className='mb-3'>
          <Form.Label htmlFor='username'>Username</Form.Label>
          <Form.Control
            type='text'
            placeholder='Your username'
            name='username'
            onChange={handleInputChange}
            value={userFormData.username}
            required
          />
        </Form.Group>

        <Form.Group className='mb-3'>
          <Form.Label htmlFor='email'>Email</Form.Label>
          <Form.Control
            type='email'
            placeholder='Your email address'
            name='email'
            onChange={handleInputChange}
            value={userFormData.email}
            required
          />
        </Form.Group>

        <Form.Group className='mb-3'>
          <Form.Label htmlFor='password'>Password</Form.Label>
          <Form.Control
            type='password'
            placeholder='Your password'
            name='password'
            onChange={handleInputChange}
            value={userFormData.password}
            required
          />
        </Form.Group>
        <Button disabled={!(userFormData.username && userFormData.email && userFormData.password)} type='submit' variant='success'>
          Submit
        </Button>
      </Form>
    </>
  );
};

export default SignupForm;
