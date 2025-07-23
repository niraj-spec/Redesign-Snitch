import React from 'react';

const Contact = () => (
  <section id="contact">
    <h2>Contact Us</h2>
    <form>
      <label htmlFor="name">Name:</label>
      <input type="text" id="name" name="name" required />
      <label htmlFor="email">Email:</label>
      <input type="email" id="email" name="email" required />
      <button type="submit">Submit</button>
    </form>
  </section>
);

export default Contact;
