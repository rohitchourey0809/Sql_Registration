function validation(values){
    let error = {}
  // Email validation
  const emailRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  if (!emailRegex.test(values.email)) {
    alert('Please enter a valid email address.');
    return false;
  }

  // Password validation
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,}$/;
  if (!passwordRegex.test(values.password)) {
    alert('Please enter a strong password that is at least 8 characters long and includes a lowercase letter, an uppercase letter, a number, and a special character.');
    return false;
  }

  // Allow form submission if validation passes
  return true;
}

export default validation;