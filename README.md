# AWS-Serverless-Task-Engine
It is an event-driven, multi-tier web application designed to demonstrate cloud-native serverless architecture, token-based security, and RESTful API operations. Built entirely on AWS infrastructure, the platform allows authenticated users to seamlessly manage tasks without requiring active server management or persistent infrastructure costs.


## Architecture & Components

The application is structured around a multi-tier serverless design:

* **Amazon S3:** Acts as the web server hosting the static frontend web page.
* **Amazon Cognito:** Functions as the identity provider managing user sign-up, login, and token generation.
* **Amazon API Gateway:** Serves as the secure front door, accepting requests and validating authentication tokens.
* **AWS Lambda:** Executes the backend Node.js code handling business logic.
* **Amazon DynamoDB:** Stores task items in a NoSQL database structure.

### Request Data Flow

1. **Download Page:** The web browser downloads and renders the static page hosted on Amazon S3.
2. **Authentication:** The user signs up or logs in through Amazon Cognito to receive an authentication token.
3. **API Request:** The browser sends task requests (including the token) to Amazon API Gateway.
4. **Compute & Persistence:** API Gateway validates the login check, triggers the AWS Lambda function, and reads or writes data to Amazon DynamoDB.

---

## Lab Setup & Configuration Steps

### Step 1: Create the Database (DynamoDB)
* Create a DynamoDB table named exactly `TasksTable`.
* Set the partition key to `taskId` with type **String**.
* Copy and save the table ARN.

### Step 2: Set up User Login (Cognito)
* Create a Cognito User Pool named `TaskAppUserPool` with **Email** as the sign-in option.
* Create an app client named `TaskAppWebClient` ensuring **No client secret** is generated (required for browser-based apps).
* Collect the **User Pool ID** and **App Client ID**.

### Step 3: Create the Permission Role and Lambda Function
* **IAM Role:** Create an execution role named `LambdaDynamoDBRole` using the `AWSLambdaBasicExecutionRole` trusted entity policy.
* **Inline Policy:** Add an inline policy named `TasksTableAccess` granting permissions for `dynamodb:PutItem`, `dynamodb:Scan`, `dynamodb:UpdateItem`, and `dynamodb:DeleteItem` on `TasksTable`.
* **Lambda Function:** Create a Node.js function named `TaskHandler` using runtime `Node.js 20.x`, attach `LambdaDynamoDBRole`, and deploy the handler code inside the `backend/` directory.

### Step 4: Create the API (API Gateway)
* Create a REST API named `TaskApi`.
* Create a Cognito Authorizer referencing `TaskAppUserPool` using `Authorization` as the token source.
* Create a `/tasks` resource, configure methods (`GET`, `POST`, `PUT`, `DELETE`) with **Lambda Proxy Integration** pointing to `TaskHandler`, and attach the Cognito Authorizer.
* Enable CORS on `/tasks`, ensure pre-flight `OPTIONS` method authorization is set to `NONE`, and deploy the API to a `prod` stage.

### Step 5: Create Website Storage (S3)
* Create an S3 bucket for hosting.
* Untick **Block all public access** and enable **Static website hosting** pointing `index.html` as the index document.
* Apply the public read bucket policy referencing your unique bucket resource path.

---

## Project File Structure

```text
aws-serverless-task-engine/
├── backend/
│   └── index.mjs               
├── frontend/
│   └── index.html              
├── policies/
│   └── lambda-iam-policy.json  
└── README.md                   
