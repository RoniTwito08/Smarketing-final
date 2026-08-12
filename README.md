# 🚀 Smarketing

**AI-powered SaaS platform that automates the creation of landing pages and Google Ads campaigns based on business information and intelligent keyword analysis.**

Smarketing was built to simplify digital advertising for small and medium-sized businesses.

Instead of manually researching keywords, building landing pages, configuring campaigns, and connecting multiple marketing tools, Smarketing brings the entire workflow into a single platform.

## ✨ Key Features

* 🧠 **AI-Powered Keyword Generation** — Generate relevant advertising keywords from business information.
* 🏗️ **Automatic Landing Page Creation** — Build campaign-specific landing pages with minimal user input.
* 📢 **Google Ads Integration** — Create and configure advertising campaigns directly through the Google Ads API.
* 💰 **Campaign & Budget Management** — Configure campaign settings and advertising budgets.
* 📊 **Analytics Dashboard** — Track campaign performance and key marketing metrics.
* 🔐 **Authentication & Account Management** — Secure user registration, login, and account handling.
* ⚡ **Automated Marketing Workflow** — Connect business onboarding, keyword generation, landing pages, and advertising campaigns into one process.

## 🔄 How It Works

```text
Business Information
        ↓
AI Keyword Generation
        ↓
Landing Page Creation
        ↓
Campaign Configuration
        ↓
Google Ads API
        ↓
Campaign Launch
        ↓
Performance Analytics
```

### 1. Business Setup

The user creates an account and provides information about their business, services, and marketing goals.

### 2. Keyword Generation

The platform analyzes the business information and uses AI to generate relevant keywords for the advertising campaign.

### 3. Landing Page Creation

A dedicated landing page is generated for the campaign using the provided business information and generated marketing content.

### 4. Campaign Creation

Campaign configuration, keywords, targeting information, and budget settings are used to create the campaign through the **Google Ads API**.

### 5. Performance Tracking

Campaign data is collected and presented through the platform's analytics dashboard, allowing users to monitor their marketing activity from one place.

## 🧱 Tech Stack

### Frontend

* React
* TypeScript
* Redux Toolkit
* Builder.io

### Backend

* Node.js
* Express
* TypeScript
* MongoDB
* Mongoose

### Authentication

* JWT

### Integrations

* Google Ads API
* Google Analytics
* AI services for keyword generation

## 🏗️ Architecture

Smarketing follows a full-stack client-server architecture:

```text
React + TypeScript
        ↓
   REST API
        ↓
Node.js + Express
        ↓
 ┌──────────────┬─────────────────┐
 ↓              ↓                 ↓
MongoDB    AI Services      Google Ads API
                                  ↓
                         Google Analytics
```

The frontend handles the campaign creation workflow and dashboard experience, while the backend manages business logic, authentication, persistent data, AI processing, and integrations with external marketing services.

## 💡 What This Project Demonstrates

Smarketing demonstrates several areas of software engineering beyond traditional CRUD development:

* **End-to-end SaaS development**
* **Full-stack application architecture**
* **AI integration into a real product workflow**
* **Complex third-party API integration**
* **Google Ads campaign automation**
* **Authentication and user management**
* **Marketing analytics integration**
* **Product-oriented system design**

The project focuses on taking a multi-step real-world marketing process and turning it into an automated software workflow.

## 🚀 Running Locally

### Prerequisites

* Node.js
* npm
* MongoDB
* Required API credentials for external integrations

### Clone the Repository

```bash
git clone https://github.com/RoniTwito08/Smarketing-final.git
cd Smarketing-final
```

### Start the Backend

```bash
cd Backend
npm install
npm run dev
```

### Start the Frontend

Open another terminal:

```bash
cd Client
npm install
npm run dev
```

> Some functionality requires valid credentials and configuration for external services such as Google Ads and AI integrations.

## 🎯 Project Goal

Digital advertising typically requires businesses to work across several separate tools — keyword research platforms, landing page builders, advertising dashboards, and analytics systems.

Smarketing explores how these steps can be combined into a single intelligent workflow.

The platform's goal is to allow a business owner to move from:

**"I want to advertise my business"**

to:

**"My landing page and advertising campaign are ready"**

with significantly less technical and marketing knowledge required.

---

**Built with React, TypeScript, Node.js, MongoDB, Google Ads API and AI.**
