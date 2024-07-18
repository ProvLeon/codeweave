"use client"
import React, { useState } from 'react';
import { TextField, Typography } from '@mui/material';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    contact: '',
    email: '',
    message: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Here you can add the logic to send the email to loetech.digital@gmail.com
    console.log('Form data submitted:', formData);
  };

  return (
    <div className=" py-20 bg-transparent bg-opacity-0 text-center shadow-lg rounded-lg flex flex-col items-center">
      <div className="w-full max-w-4xl px-4 flex flex-col justify-center items-center">
        <Card className="w-full shadow-xl rounded-lg overflow-hidden">
          <CardContent className="p-8">
            <Typography variant="h3" component="h2" className="mb-8  text-light-heading dark:text-dark-heading">
              Contact Us
            </Typography>
            <form onSubmit={handleSubmit} className="space-y-6 dark:text-dark-text">
              <TextField
                fullWidth
                variant="outlined"
                label="Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="bg-white dark:bg-dark-border rounded-lg dark:border-dark-text"
                InputLabelProps={{
                  className: 'text-light-text dark:text-dark-text'
                }}
                InputProps={{
                  className: 'text-light-text dark:text-dark-text'
                }}
              />
              <TextField
                fullWidth
                variant="outlined"
                label="Contact"
                name="contact"
                value={formData.contact}
                onChange={handleChange}
                required
                className="bg-white dark:bg-dark-border rounded-lg"
                InputLabelProps={{
                  className: 'text-light-text dark:text-dark-text'
                }}
                InputProps={{
                  className: 'text-light-text dark:text-dark-text'
                }}
              />
              <TextField
                fullWidth
                variant="outlined"
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="bg-white dark:bg-dark-border rounded-lg"
                InputLabelProps={{
                  className: 'text-light-text dark:text-dark-text'
                }}
                InputProps={{
                  className: 'text-light-text dark:text-dark-text'
                }}
              />
              <TextField
                fullWidth
                variant="outlined"
                label="Message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                multiline
                rows={4}
                required
                className="bg-white dark:bg-dark-border rounded-lg"
                InputLabelProps={{
                  className: 'text-light-text dark:text-dark-text'
                }}
                InputProps={{
                  className: 'text-light-text dark:text-dark-text'
                }}
              />
              <Button type="submit" variant="default" className="py-3 w-full rounded-lg">
                Send Message
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>

    </div>
  );
};

export default Contact;
