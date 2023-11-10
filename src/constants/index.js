// Required matches or regular expressions
module.exports.REGEX = {
  EMAIL_REGEX:
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
  PASSWORD_REGEX: /^(?=.*\d).{4,}$/,
};

// Messages that should be sent as responses
module.exports.MESSAGES = {
	LOGIN_SUCCESS: 'Login Successful',
	LOGIN_FAILED: 'Login Failed',
	INVALID_CREDENTIALS: 'Incorrect username or password',
	NO_ACCESS: 'Not authorized to perform this operation, please Login to authenticated',
	AUTHENTICATED: 'Already authenticated',
	SERVER_ERROR: "There's been a problem processing your request. Please try again or contact support",
};
