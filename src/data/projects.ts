import type { ProjectGroup } from "./project-groups";

export interface Project {
  slug: string;
  title: string;
  group: ProjectGroup | "unlisted";
  selectedWorkGroup?: ProjectGroup;
  tools: string[];
  summary: string;
  cover: string;
  coverAlt: string;
  year: string;
  client?: string;
  services: string;
  overview: string;
  details?: string;
  context: string;
  coverage: string;
  caseStudy: {
    checks?: { area: string; verification: string }[];
    deliverable: string;
  };
  next: string;
}

export const projects: Project[] = [
  {
    slug: "bsec-ipo-system",
    title: "BSEC IPO System",
    group: "product",
    tools: ["System QA", "Regression testing", "RBAC"],
    summary: "Quality assurance for the Bangladesh Securities and Exchange Commission’s IPO system.",
    cover: "images/work/bsec-ipo-system.webp",
    coverAlt: "BSEC seal beside the public BSEC IPO portal sign-in screen.",
    year: "2024",
    client: "BSEC",
    services: "Branding & System QA",
    overview: "I performed end-to-end system testing across investor registration, financial calculations, multi-role approvals, and document uploads.",
    context: "Investor submissions had to move between authorized roles while preserving the financial values and supporting documents used during IPO subscription.",
    coverage: "I tested the workflows where permissions, financial validation, and supporting documents mattered most.",
    caseStudy: {
      checks: [
        { area: "Role-based approvals", verification: "Check which actions each role can take as a submission moves through the approval workflow." },
        { area: "Financial forms", verification: "Verify financial calculations and check input validation on registration and IPO allotment forms." },
        { area: "Document uploads", verification: "Check that supporting documents can be uploaded as part of an investor submission." },
      ],
      deliverable: "I ran regression checks across the portal, covering role-based access, IPO allotment forms, and the core investor workflows.",
    },
    next: "dnothi"
  },
  {
    slug: "qa-brains-ts-playwright",
    title: "QA Brains Automation · TypeScript",
    group: "automation",
    tools: ["TypeScript", "Playwright", "GitHub Actions"],
    summary: "An end-to-end Playwright suite with network mocks, traces, and visual regression checks.",
    cover: "images/work/qa-brains-ts-playwright.webp",
    coverAlt: "Public QA Brains practice login beside a diagram showing a network fixture, a visual check, and a Playwright trace.",
    year: "2024",
    client: "QA Brains",
    services: "TypeScript & Playwright",
    overview: "I built a TypeScript and Playwright test suite for the QA Brains practice site. It uses the Page Object Model, visual regression checks, API mocks, and retries in GitHub Actions.",
    details: "Designed for fast execution, type safety, modular test maintenance, network intercept mocking, and interactive HTML trace reporting.",
    context: "High-efficiency automation framework supporting asynchronous test execution, web assertion verification, network API fixtures, and automated browser trace inspection.",
    coverage: "Full-stack web application automation, custom assertion libraries, fixture setup, visual diff testing, and GitHub Actions CI integration using Playwright and TypeScript.",
    caseStudy: {
      deliverable: "The Playwright suite can run in GitHub Actions and uses network fixtures and browser traces to reproduce and inspect failures.",
    },
    next: "restful-booker"
  },
  {
    slug: "restful-booker",
    title: "Restful Booker",
    group: "automation",
    tools: ["API testing", "Postman", "REST Assured"],
    summary: "API automation for a hotel booking service, including authentication and schema checks.",
    cover: "images/work/restful-booker.webp",
    coverAlt: "Restful Booker API test scenario. Create a booking with POST /booking, then use the returned ID to retrieve it.",
    year: "2023",
    client: "Restful Booker",
    services: "API Automation",
    overview: "I built an automated test suite for the Restful Booker practice API covering booking operations, token authentication, response schemas, and status codes.",
    context: "Focuses on backend API payload validation, response time benchmarking, and edge-case security testing using Postman, RestAssured, and automated scripts.",
    coverage: "Complete backend API verification, JSON payload assertions, header token management, and dynamic test collection execution.",
    caseStudy: {
      deliverable: "The API suite checks booking operations, authentication, status codes, and response schemas using Postman and REST Assured.",
    },
    next: "bsec-ipo-system"
  },
  {
    slug: "qa-brains-java-playwright",
    title: "QA Brains Automation · Java",
    group: "automation",
    tools: ["Java", "Playwright", "GitHub Actions"],
    summary: "An end-to-end browser testing framework built with Java and Playwright.",
    cover: "images/work/qa-brains-java-playwright.webp",
    coverAlt: "Java and Playwright smoke test flow through Chromium, Firefox, and WebKit into an Allure report.",
    year: "2023",
    client: "QA Brains",
    services: "Java & Playwright",
    overview: "I designed and built the Java Playwright framework, organized shared page interactions with the Page Object Model, and integrated test runs with GitHub Actions.",
    context: "I used the QA Brains practice site to build a suite that could rerun browser checks across engines and report failures after automated runs.",
    coverage: "The framework supports parallel execution and multiple environment configurations.",
    caseStudy: {
      checks: [
        { area: "Cross-browser behavior", verification: "Run browser checks across Chromium, Firefox, and WebKit to surface differences between engines." },
        { area: "Repeatable test inputs", verification: "Generate test data for automated runs so checks can be repeated with fresh inputs." },
        { area: "Smoke and regression checks", verification: "Run the suite in GitHub Actions and review the results in an Allure HTML report." },
      ],
      deliverable: "The framework can rerun smoke and regression checks in CI and produces an Allure HTML report for reviewing execution results.",
    },
    next: "qa-brains-ts-playwright"
  },
  {
    slug: "dnothi",
    title: "dNothi",
    group: "product",
    tools: ["Functional testing", "UI testing", "Performance testing"],
    summary: "Functional and performance testing for Bangladesh’s national e-filing platform.",
    cover: "images/work/dnothi.webp",
    coverAlt: "dNothi’s public sign-in page alongside the case study’s approval and archive workflow.",
    year: "2024",
    client: "Government of Bangladesh",
    services: "Web Designing & QA",
    overview: "Functional, UI design, and performance testing for dNothi (Government E-Nothi System), Bangladesh's national administrative digital file tracking platform. Enabled official note approvals, digital letter dispatch, and document archiving across government ministries.",
    context: "Nationwide e-filing web platform validation covering user permission hierarchies, digital signature verification, audit trail logging, and system response times under heavy civil service load.",
    coverage: "Detailed web UI design validation, user role permission verification, digital signature integration testing, document security auditing, and bug tracking for the national e-filing platform.",
    caseStudy: {
      deliverable: "I tested official note approvals, digital letter dispatch, and document archiving, including how those workflows behaved under load.",
    },
    next: "practice-management-system"
  },
  {
    slug: "practice-management-system",
    title: "Practice Management System",
    group: "product",
    tools: ["System QA", "Integration testing", "Regression testing"],
    summary: "System testing for legal case management, scheduling, invoicing, and document workflows.",
    cover: "images/work/practice-management-system.webp",
    coverAlt: "Sample invoice showing how recorded time and the billing rate determine the total.",
    year: "2024",
    services: "Architecture & QA",
    overview: "End-to-end software quality engineering and system architecture validation for the Practice Management System. Tested case tracking, automated legal billing & invoicing engines, calendar scheduling integrations, time-tracking logs, and secure document storage.",
    context: "Comprehensive legal and corporate practice portal verification ensuring accurate financial calculations, multi-client record isolation, encrypted client file access, and seamless integration across practice modules.",
    coverage: "System architecture QA, automated invoice billing validation, legal case workflow testing, schedule sync verification, role-based data encryption, and regression suite execution.",
    caseStudy: {
      deliverable: "I tested whether case records, appointments, invoices, and documents stayed consistent across connected parts of the portal.",
    },
    next: "qa-brains-java-playwright"
  },
  /* Temporarily hidden. Remove the comment markers to restore both projects.
  {
    slug: "mrmax",
    title: "MrMax",
    group: "unlisted",
    selectedWorkGroup: "product",
    tools: ["Web QA", "Cross-browser testing"],
    summary: "Cross-browser testing for an e-commerce platform and its checkout workflows.",
    cover: "images/work/mrmax.webp",
    coverAlt: "The MrMax logo and name beside desktop and mobile views of the online store homepage.",
    year: "2023",
    client: "MrMax",
    services: "Web Designing & QA",
    overview: "Comprehensive web application testing, UI/UX design validation, and responsive interface verification for the MrMax platform. Ensured seamless browsing, dynamic filtering, secure cart/checkout transactions, and cross-browser responsiveness across desktop and mobile devices.",
    details: "Implemented end-to-end user journey validation, bug tracking, and front-end performance optimization checks to maintain high system stability and user engagement.",
    context: "MrMax project focuses on delivering a robust, sleek e-commerce user experience with stringent Quality Assurance standards and thorough test coverage across core web application workflows.",
    coverage: "Thorough web interface verification, test suite execution, cross-browser compatibility testing, responsive design QA, and performance benchmarking for the MrMax platform.",
    caseStudy: {
      deliverable: "I tested browsing, filtering, cart updates, and checkout across desktop and mobile browsers.",
    },
    next: "qa-brains-java-playwright"
  },
  {
    slug: "gcc-mealkun",
    title: "GCC Mealkun",
    group: "unlisted",
    selectedWorkGroup: "product",
    tools: ["Mobile QA", "Compatibility testing"],
    summary: "Mobile quality assurance for a catering and meal management app.",
    cover: "images/work/gcc-mealkun.webp",
    coverAlt: "Mealkun’s mascot beside the published meal-planning calendar screen.",
    year: "2023",
    client: "GCC Mealkun",
    services: "Mobile Designing & QA",
    overview: "Quality Assurance and mobile UI/UX design validation for GCC Mealkun, a catering and meal management mobile app. Ensured smooth navigation, responsive interface layout across various smartphone resolutions, and error-free order processing.",
    context: "Mobile QA testing focusing on touch gesture responsiveness, push notification delivery, network state resilience (offline/3G), and overall user experience verification.",
    coverage: "Mobile interface testing, cross-device compatibility validation, payment flow QA, regression suite execution, and performance assessment.",
    caseStudy: {
      deliverable: "I ran mobile regression checks across navigation, ordering, payment flows, and changes in connectivity.",
    },
    next: "bsec-ipo-system"
  }
  */
];

export const publicProjects = projects.filter(({ group }) => group !== "unlisted");

const selectedWorkOrder = new Map([
  "mrmax",
  "gcc-mealkun",
  "dnothi",
  "bsec-ipo-system",
  "practice-management-system",
].map((slug, index) => [slug, index]));

export const orderedProjects = [...projects].sort((first, second) => {
  const firstPosition = selectedWorkOrder.get(first.slug) ?? selectedWorkOrder.size;
  const secondPosition = selectedWorkOrder.get(second.slug) ?? selectedWorkOrder.size;
  return firstPosition - secondPosition;
});

export const selectedProjects = orderedProjects
  .filter(({ group, selectedWorkGroup }) => group !== "unlisted" || selectedWorkGroup !== undefined);
