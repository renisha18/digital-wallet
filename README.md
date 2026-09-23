# Digital Wallet Security Lab

A web-based digital wallet application developed as a **hands-on web security learning project** to understand common vulnerabilities and how they affect application security.

> **Educational project:** This application is intentionally designed to demonstrate common web vulnerabilities in a controlled environment. It is **not intended for handling real financial transactions, credentials, or sensitive user data.**

## 🎯 Objective

The project was built to move beyond theoretical cybersecurity concepts by implementing a small web application and studying how common vulnerabilities can occur in real application flows.

The primary security topics explored are:

* SQL Injection
* Cross-Site Scripting (XSS)
* Broken Authentication

The project focuses on understanding:

**How the vulnerability occurs → how it can be exploited in a controlled environment → what the impact is → how it can be mitigated.**

---

## 🔐 Security Vulnerabilities Studied

### 1. SQL Injection

SQL Injection occurs when untrusted user input is incorporated into SQL queries without appropriate parameterization or validation.

#### Example scenario

A login or wallet-related query accepts user-controlled input and constructs a SQL statement directly.

```text
User Input
    ↓
Application
    ↓
Unsafe SQL Query
    ↓
Database
```

An attacker may manipulate the input so that the resulting SQL query behaves differently from what the developer intended.

### What this project demonstrates

* How unsafe query construction creates an injection point
* How attacker-controlled input can alter database queries
* The potential impact on authentication and application data
* How parameterized queries/prepared statements can prevent injection

### Mitigation

The secure implementation should use:

* Parameterized queries
* Prepared statements
* Input validation
* Least-privilege database accounts

---

## 2. Cross-Site Scripting (XSS)

XSS occurs when an application places untrusted user-controlled content into a web page without appropriate output encoding or sanitization.

### Example scenario

A user-controlled value is stored or reflected by the application and subsequently interpreted as HTML/JavaScript by the browser.

```text
Attacker-controlled input
          ↓
      Application
          ↓
       Web page
          ↓
       Browser
          ↓
 Unintended script execution
```

### Types explored

Depending on the implementation, the project can demonstrate:

* Reflected XSS
* Stored XSS

### Impact

Depending on the application context, XSS can potentially allow an attacker to:

* Execute JavaScript in another user's browser
* Modify page content
* Perform actions using the victim's authenticated session
* Access information exposed to client-side scripts

### Mitigation

Possible defenses include:

* Context-aware output encoding
* Input validation
* Sanitization where appropriate
* Content Security Policy (CSP)
* Secure cookie configuration

---

## 3. Broken Authentication

Authentication vulnerabilities occur when an application does not correctly protect the process used to establish and maintain a user's identity.

### Scenarios studied

The project explores weaknesses such as:

* Weak authentication logic
* Improper session handling
* Insufficient authentication checks
* Missing authorization checks on protected functionality

### Example flow

```text
Unauthenticated User
        ↓
   Protected Endpoint
        ↓
  Missing/Weak Check
        ↓
Unauthorized Access
```

### Mitigation

Security controls include:

* Strong password handling
* Secure session management
* Proper authentication checks
* Authorization checks on protected resources
* Appropriate session expiration
* Secure cookie configuration

---

# 🏗️ Application Overview

The application represents a simplified digital wallet where users can interact with wallet-related functionality.

The application was intentionally kept small so that security vulnerabilities and their underlying causes could be studied clearly.

### High-Level Architecture

```text
              ┌─────────────────┐
              │   Web Browser   │
              └────────┬────────┘
                       │
                       ▼
              ┌─────────────────┐
              │  Web Frontend   │
              └────────┬────────┘
                       │
                       ▼
              ┌─────────────────┐
              │    Backend      │
              │ Authentication  │
              │ Wallet Logic    │
              └────────┬────────┘
                       │
                       ▼
              ┌─────────────────┐
              │    Database     │
              └─────────────────┘
```

---

# 🧪 Security Testing Approach

Each vulnerability is studied in a controlled local environment.

The testing process follows:

```text
1. Identify application input
          ↓
2. Understand the normal application flow
          ↓
3. Identify the security weakness
          ↓
4. Construct a controlled test case
          ↓
5. Observe the application behavior
          ↓
6. Analyze the security impact
          ↓
7. Apply mitigation
          ↓
8. Retest
```

This approach helps connect theoretical security concepts with practical application behavior.

---

# 🛡️ Security Lessons

The project demonstrates several important principles of secure web development:

### Never trust user input

All user-controlled input should be treated as untrusted.

### Separate data from code

Parameterized queries prevent user input from becoming part of SQL syntax.

### Encode output appropriately

User-controlled content should not be interpreted as executable browser code.

### Authentication ≠ Authorization

Successfully identifying a user does not automatically mean that the user should have access to every resource or operation.

### Security requires testing

A security control should be tested against the same attack scenario it is intended to prevent.

---

# ⚠️ Ethical Use

This project is intended **only for educational and authorized security testing**.

The intentionally vulnerable components should be executed only in a local or otherwise controlled environment.

Do not use the techniques demonstrated in this project against applications, systems, accounts, or networks without explicit authorization.

---

# 📚 Learning Outcomes

Through this project, the following concepts were studied:

* Web application attack surfaces
* SQL Injection
* Cross-Site Scripting
* Authentication and authorization
* Input validation
* Secure database queries
* Session security
* Secure web application design
* Vulnerability testing and mitigation

---

# 🚧 Limitations

This is a learning-oriented security lab and is **not a production digital wallet**.

It does not attempt to implement:

* Real financial transactions
* Banking/payment-network integration
* Production-grade cryptographic key management
* Regulatory compliance
* Real customer financial data
* Production security monitoring

---

# 🔮 Future Improvements

Potential extensions include:

* CSRF protection
* Rate limiting
* Secure password hashing and password policies
* Multi-factor authentication
* Content Security Policy
* Security logging and monitoring
* Automated security testing
* Role-based access control
* Dependency vulnerability scanning
* Containerized isolated security labs
