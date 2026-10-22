# AgroConnect PWA

AgroConnect is an AI-driven crop disease management system designed for farmers and agricultural stakeholders. It combines computer vision, retrieval-augmented generation (RAG), and multilingual support to help identify crop diseases and provide actionable treatment guidance.

## Project context

This repository consolidates the project context from the original AgroConnect implementation and establishes a production-ready starter for a full-stack AgriTech platform.

### Original implementation context
- Flutter-based cross-platform application for web and Android
- ResNet50-based disease prediction pipeline
- RAG-based treatment and crop guidance assistant
- GEMMA-based context-aware answer generation
- Multilingual support for broader accessibility
- Dataset of 450+ crop diseases and pests across India
- Data sources include agritech references, Indian agricultural institutions, and crop protection databases

### Core features
- Analyze crop images using a pretrained CNN model
- Query a RAG-based model for treatment and disease answers
- Generate context-aware responses using an LLM
- Support multilingual use cases for wider farm accessibility
- Provide recommendations for disease causes, symptoms, and treatments

## Repository goals

This repository is structured as a full-stack starter for:
- Angular + shadcn-inspired UI frontend
- Java Spring Boot backend API
- AI disease prediction and RAG service integration
- PWA/mobile-first app experience
- Project board and contributor management

## Stack

### Frontend
- Angular
- Tailwind CSS
- shadcn-inspired UI primitives
- PWA-ready design

### Backend
- Java 21
- Spring Boot 3.x
- REST API
- AI/ML integration layer

## Directory structure

- `frontend/` — Angular application
- `backend/` — Spring Boot backend
- `docs/` — design and project docs
- `PROJECT_BOARD.md` — GitHub Project board outline
- `GITHUB_ISSUES.md` — issue backlog
- `CONTRIBUTING.md` — contribution guide

## Local setup

### Frontend
```bash
cd frontend
npm install
npm run start
```

### Backend
```bash
cd backend
./mvnw clean install
./mvnw spring-boot:run
```

## Roadmap

The project is organized around a PWA-first, field-ready AgriTech architecture focused on:
- disease prediction workflows
- treatment and crop management guidance
- mobile-first usability
- offline support
- multilingual support
- model evaluation and deployment readiness

## Project board

See `PROJECT_BOARD.md` for the GitHub Projects backlog and workflow.

## Issue backlog

See `GITHUB_ISSUES.md` for the repository backlog and suggested issues.

## Contributing

See `CONTRIBUTING.md` for contributor onboarding and guidelines.

## Notes

This repository blends the original AgroConnect concept with a modern production-ready architecture so it is easier to build, track, and extend collaboratively.
