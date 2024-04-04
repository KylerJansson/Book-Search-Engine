// see SignupForm.js for comments
import { useState } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';
import { useMutation } from '@apollo/client';
import { LOGIN_USER } from '../utils/mutations';
import Auth from '../utils/auth';

const LoginForm = () => {
  const [userFormData, setUserFormData] = useState({ email: '', password: '' });
  const [showAlert, setShowAlert] = useState(false);
  const [login, { loading, error }] = useMutation(LOGIN_USER, {
    onCompleted: (data) => {
      Auth.login(data.login.token);
    }
  });

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setUserFormData({ ...userFormData, [name]: value });
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    const form = event.currentTarget;

    if (form.checkValidity() === false) {
      event.stopPropagation();
    } else {
      try {
        await login({
          variables: {
            email: userFormData.email,
            password: userFormData.password
          }
        });
      } catch (e) {
        console.error('Login Error:', e);
        setShowAlert(true);
      }

      // Reset user form data
      setUserFormData({
        email: '',
        password: '',
      });
    }
  };

  return (
    <>
      <Form noValidate onSubmit={handleFormSubmit}>
        {showAlert && (
          <Alert dismissible onClose={() => setShowAlert(false)} show={showAlert} variant='danger'>
            {error ? error.message : 'Something went wrong with your login credentials!'}
          </Alert>
        )}
        <Form.Group className='mb-3'>
          <Form.Label htmlFor='email'>Email</Form.Label>
          <Form.Control
            type='text'
            placeholder='Your email'
            name='email'
            onChange={handleInputChange}
            value={userFormData.email}
            required
          />
          <Form.Control.Feedback type='invalid'>Email is required!</Form.Control.Feedback>
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
          <Form.Control.Feedback type='invalid'>Password is required!</Form.Control.Feedback>
        </Form.Group>
        <Button
          disabled={!userFormData.email || !userFormData.password || loading}
          type='submit'
          variant='success'>
          {loading ? 'Logging in...' : 'Submit'}
        </Button>
      </Form>
    </>
  );
};

export default LoginForm;
