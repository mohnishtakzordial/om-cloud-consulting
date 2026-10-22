/**
 * Om Cloud Consulting (OCC) - Interactive Application Logic
 * Agentforce AI Simulator, Dynamic Portfolio Filters, Project Estimator & Architecture Modal
 */

document.addEventListener('DOMContentLoaded', () => {
  initNavbarScroll();
  initSmoothScroll();
  initAgentforceSimulator();
  initPortfolioFilters();
  initProjectEstimator();
  initArchitectureModal();
  initContactForm();
  initFaqAccordion();
  initMobileMenu();
});

/* ==========================================================================
   2. Sticky Navbar & Active Section Tracking
   ========================================================================== */
function initNavbarScroll() {
  const navbar = document.getElementById('main-navbar');
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    // Active link highlighting
    let currentId = '';
    const scrollPos = window.scrollY + 200;

    sections.forEach(sec => {
      const top = sec.offsetTop;
      const height = sec.offsetHeight;
      if (scrollPos >= top && scrollPos < top + height) {
        currentId = sec.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentId}`) {
        link.classList.add('active');
      }
    });
  });
}

function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#' || targetId === '') return;
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        e.preventDefault();
        targetElement.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });
}

/* ==========================================================================
   3. Agentforce AI Interactive Simulator
   ========================================================================== */
function initAgentforceSimulator() {
  const scenarioSelector = document.getElementById('sim-scenario-select');
  const autonomySelect = document.getElementById('sim-autonomy-level');
  const runBtn = document.getElementById('sim-run-btn');
  const resetBtn = document.getElementById('sim-reset-btn');
  const logWindow = document.getElementById('sim-log-window');
  const statusDot = document.getElementById('sim-status-dot');
  const statusText = document.getElementById('sim-status-text');

  if (!scenarioSelector || !runBtn) return;

  const scenarios = {
    ncino_loan: {
      name: 'nCino Commercial Loan Pre-Qualification Agent',
      userPrompt: 'Applicant Apex Logistics LLC requests $2.5M working capital term loan. Tax returns verified.',
      steps: [
        { badge: 'atlas', badgeText: 'ATLAS REASONING', text: 'Analyzing inbound loan inquiry payload & verifying KYC documents via nCino Document Manager.' },
        { badge: 'action', badgeText: 'DATA 360 QUERY', text: 'Queried Salesforce Data Cloud unified financial graph: Apex Logistics LLC (DSCR: 1.48x, FICO: 760, Net Worth: $8.4M).' },
        { badge: 'guardrail', badgeText: 'CREDIT POLICY CHECK', text: 'Evaluated against Bank Underwriting Guidelines: Loan amount ($2.5M) ≤ max uncollateralized threshold. Risk tier: Low.' },
        { badge: 'action', badgeText: 'NCINO CRM WRITE', text: 'Invoked nCino API: Created Loan record LLC_BI__Loan__c [ID: a1B7R000004xK9U] with Product: "Commercial Term 60M", Stage: "Underwriting".' },
        { badge: 'success', badgeText: 'AGENT COMPLETED', text: 'Autonomous task executed in 840ms. Automated email dispatch sent to Relationship Manager Yash Agrawal for final sign-off.' }
      ]
    },
    health_cloud: {
      name: 'Health Cloud Autonomous Patient Triage & Care Plan Agent',
      userPrompt: 'Patient Maria Hernandez (ID: HC-9921) telemetry shows SpO2 drop to 89% with high heart rate.',
      steps: [
        { badge: 'atlas', badgeText: 'ATLAS REASONING', text: 'Detected biometric alert stream via IoT integration. Ingesting HL7 FHIR Observation resource.' },
        { badge: 'action', badgeText: 'HEALTH CLOUD MATCH', text: 'Matched EHR record to Account [HC-9921]. Primary diagnosis: Chronic Bronchitis. Care Team: Dr. Rahul Sharma (Pulmonology).' },
        { badge: 'guardrail', badgeText: 'HIPAA & CLINICAL PROTOCOL', text: 'Triggered Clinical Escalation Matrix Protocol #4 (Respiratory Distress Alert). Verified zero HIPAA PHI exposure.' },
        { badge: 'action', badgeText: 'SALESFORCE ACTION', text: 'Created Clinical Case (Priority: Urgent) & dispatched SMS alert to On-Duty Nurse via Experience Cloud Mobile.' },
        { badge: 'success', badgeText: 'AGENT COMPLETED', text: 'Patient Care Plan CarePlanGoal__c updated. Emergency encounter slot reserved in Clinic Schedule in 610ms.' }
      ]
    },
    support_deflection: {
      name: 'Service Cloud Omnichannel Deflection & Billing Agent',
      userPrompt: 'Customer inquiries: "Why was my enterprise API renewal billed twice on Oct 20th invoice #INV-4921?"',
      steps: [
        { badge: 'atlas', badgeText: 'ATLAS REASONING', text: 'Classifying customer sentiment and intent: High priority billing discrepancy.' },
        { badge: 'action', badgeText: 'DATA 360 UNIFIED PROFILE', text: 'Cross-referenced Stripe billing webhook with Salesforce Billing Invoice record INV-4921.' },
        { badge: 'guardrail', badgeText: 'SOX COMPLIANCE', text: 'Identified duplicate pending charge token. Refund auto-authorization policy verified for < $5,000 threshold.' },
        { badge: 'action', badgeText: 'REFUND & VOID DISPATCH', text: 'Issued $1,200 immediate credit memo in Salesforce Billing and sent cancellation receipt to customer.' },
        { badge: 'success', badgeText: 'AGENT COMPLETED', text: 'Resolved autonomously without human agent involvement. Deflected Tier-2 escalation ticket. CSAT: 5.0.' }
      ]
    }
  };

  // Switch pill clicks
  document.querySelectorAll('.scenario-pill-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.scenario-pill-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const val = btn.getAttribute('data-scenario');
      scenarioSelector.value = val;
      resetConsole();
    });
  });

  scenarioSelector.addEventListener('change', () => {
    const val = scenarioSelector.value;
    document.querySelectorAll('.scenario-pill-btn').forEach(b => {
      b.classList.toggle('active', b.getAttribute('data-scenario') === val);
    });
    resetConsole();
  });

  runBtn.addEventListener('click', () => {
    const key = scenarioSelector.value;
    const scenario = scenarios[key];
    if (!scenario) return;

    runBtn.disabled = true;
    runBtn.innerHTML = '<span class="badge-pulse-dot" style="display:inline-block;margin-right:8px;"></span> Executing Atlas Reasoning...';
    statusText.textContent = 'Atlas Engine Active (Reasoning...)';
    statusDot.style.background = '#3b82f6';
    statusDot.style.boxShadow = '0 0 10px #3b82f6';

    logWindow.innerHTML = `
      <div class="log-step">
        <span class="log-badge" style="color:#00e5ff;">USER INGEST:</span>
        "${scenario.userPrompt}"
      </div>
    `;

    let stepIndex = 0;
    const interval = setInterval(() => {
      if (stepIndex < scenario.steps.length) {
        const item = scenario.steps[stepIndex];
        const stepDiv = document.createElement('div');
        stepDiv.className = 'log-step';
        stepDiv.innerHTML = `
          <span class="log-badge ${item.badge}">[${item.badgeText}]</span>
          ${item.text}
        `;
        logWindow.appendChild(stepDiv);
        logWindow.scrollTop = logWindow.scrollHeight;
        stepIndex++;
      } else {
        clearInterval(interval);
        runBtn.disabled = false;
        runBtn.innerHTML = '<svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg> Run Autonomous Agent';
        statusText.textContent = 'Atlas Engine Ready (Idle)';
        statusDot.style.background = '#10b981';
        statusDot.style.boxShadow = '0 0 10px #10b981';
      }
    }, 600);
  });

  resetBtn.addEventListener('click', resetConsole);

  function resetConsole() {
    logWindow.innerHTML = `
      <div style="color: var(--text-muted); font-style: italic; padding: 20px 0; text-align: center;">
        Select an enterprise scenario on the left and click "Run Autonomous Agent" to witness real-time Atlas Reasoning Engine orchestration.
      </div>
    `;
    statusText.textContent = 'Atlas Engine Ready (Idle)';
    statusDot.style.background = '#10b981';
  }
}

/* ==========================================================================
   4. Portfolio Filtering System
   ========================================================================== */
function initPortfolioFilters() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const portfolioCards = document.querySelectorAll('.portfolio-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      portfolioCards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filterValue === 'all' || category === filterValue || category.includes(filterValue)) {
          card.style.display = 'flex';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 50);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(20px)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 250);
        }
      });
    });
  });
}

/* ==========================================================================
   5. Interactive Project & Sprint Estimator
   ========================================================================== */
function initProjectEstimator() {
  const checkboxes = document.querySelectorAll('.solution-checkbox');
  const teamScaleSelect = document.getElementById('est-team-scale');
  const weeksResult = document.getElementById('est-weeks-count');
  const sprintCount = document.getElementById('est-sprint-count');
  const teamModelText = document.getElementById('est-team-model');
  const archReviewStatus = document.getElementById('est-arch-review');

  if (!checkboxes.length || !weeksResult) return;

  function recalculate() {
    let baseDays = 0;
    let selectedCount = 0;

    checkboxes.forEach(cb => {
      const pill = cb.closest('.checkbox-pill');
      if (cb.checked) {
        selectedCount++;
        pill.classList.add('selected');
        baseDays += parseInt(cb.getAttribute('data-days') || '10', 10);
      } else {
        pill.classList.remove('selected');
      }
    });

    if (selectedCount === 0) {
      weeksResult.textContent = '0 wks';
      sprintCount.textContent = '0 Sprints';
      teamModelText.textContent = 'Select Solutions';
      archReviewStatus.textContent = 'Pending';
      return;
    }

    const scaleFactor = parseFloat(teamScaleSelect ? teamScaleSelect.value : '1.0');
    // Team acceleration factor
    const effectiveDays = Math.max(12, Math.round(baseDays / scaleFactor));
    const weeks = Math.ceil(effectiveDays / 5);
    const sprints = Math.ceil(weeks / 2);

    weeksResult.textContent = `${weeks} Weeks`;
    sprintCount.textContent = `${sprints} Sprints (2-wk cycles)`;

    if (scaleFactor === 1.0) {
      teamModelText.textContent = '1 Lead Architect + 2 Sr. Developers';
    } else if (scaleFactor === 1.5) {
      teamModelText.textContent = '1 Solution Architect + 3 Developers + 1 QA';
    } else {
      teamModelText.textContent = 'Enterprise Pod: 2 Architects + 4 Devs + 2 QA';
    }

    archReviewStatus.textContent = selectedCount >= 3 ? 'Comprehensive Well-Architected' : 'Standard OCC Review';
  }

  checkboxes.forEach(cb => cb.addEventListener('change', recalculate));
  if (teamScaleSelect) teamScaleSelect.addEventListener('change', recalculate);

  // Initial calculation
  recalculate();
}

/* ==========================================================================
   6. Architecture Modal Viewer
   ========================================================================== */
function initArchitectureModal() {
  const modal = document.getElementById('arch-modal');
  const closeBtn = document.getElementById('modal-close-btn');
  const modalTitle = document.getElementById('modal-title');
  const modalCategory = document.getElementById('modal-category');
  const modalBlueprint = document.getElementById('modal-blueprint');
  const modalHighlights = document.getElementById('modal-highlights');
  const modalImpact = document.getElementById('modal-impact');

  if (!modal || !closeBtn) return;

  const archBlueprints = {
    ncino: {
      title: 'nCino Commercial Lending & Automated Decisioning Architecture',
      category: 'Fintech & Banking Operating System',
      blueprint: `
+-----------------------------------------------------------------------------------------+
|                                    nCino UX / Portal                                    |
|   Borrower Portal (Experience Cloud) <---> Loan Officer Console (Lightning App)        |
+-----------------------------------------------------------------------------------------+
                                           |
                                  [LLC_BI Data Model]
                                           |
   +--------------------+------------------+------------------+--------------------+
   | Underwriting Engine| Document Manager | Covenant Manager | Product Catalog    |
   | (Policy Matrix)    | (Auto-OCR / Box) | (Alert Triggers) | (Pricing & Limits) |
   +--------------------+------------------+------------------+--------------------+
                                           |
                        [MuleSoft Anypoint / Integration Core]
                                           |
    +------------------------+------------------------+------------------------+
    | Core Banking (FIS/Fiserv)| Credit Bureau (Experian)| General Ledger (SAP/FFA)|
    +------------------------+------------------------+------------------------+
      `,
      highlights: [
        'End-to-end commercial loan origination with automated Spreading and Financial Statements extraction.',
        'Zero-trust compliance: PCI-DSS, SOC2, and FDIC automated audit logging on all financial decision points.',
        'Custom Lightning Web Components (LWC) for multi-tiered loan covenant tracking and automated grace-period notifications.'
      ],
      impact: '68% reduction in loan cycle time (from 28 days to 9 days) and 100% adherence to federal lending regulations.'
    },
    agentforce: {
      title: 'Agentforce Autonomous AI Architecture with Atlas Reasoning Engine',
      category: 'Autonomous Enterprise AI',
      blueprint: `
+-----------------------------------------------------------------------------------------+
|                  Multimodal Channels (WhatsApp, Web Chat, Voice, Email)                 |
+-----------------------------------------------------------------------------------------+
                                           |
                         [Salesforce Trust & Safety Boundary]
                                           |
                      +--------------------+--------------------+
                      | Prompt Shield / PII Masking / Toxic Guardrail |
                      +--------------------+--------------------+
                                           |
                        [Atlas Reasoning Engine (ReAct Loop)]
                                           |
      +--------------------+---------------+--------------------+
      | Data Cloud Vector  | Apex Invocable| Flow & External    |
      | RAG Knowledge Base | Action Logic  | REST API Connectors|
      +--------------------+---------------+--------------------+
                                           |
                         [CRM Core: Sales / Service / Health]
      `,
      highlights: [
        'Native Atlas Reasoning Engine ReAct orchestration with deterministic business logic safety boundaries.',
        'Real-time Data Cloud vector retrieval (RAG) grounded in enterprise knowledge articles, CRM records, and telemetry.',
        'Zero fine-tuning required: Invocable Apex methods enable agents to perform CRM mutations autonomously with rollback safeguards.'
      ],
      impact: '42% first-contact autonomous case resolution rate without human agent escalation.'
    },
    data360: {
      title: 'Salesforce Data Cloud (Data 360) Ingestion & Real-Time Activation',
      category: 'Customer 360 & Streaming Data Engine',
      blueprint: `
+-----------------------------------------------------------------------------------------+
|  Source Streams: Webhook CDC, POS Streaming, Snowflake Data Share, Mobile Telemetry   |
+-----------------------------------------------------------------------------------------+
                                           |
                         [Data Cloud Ingestion Lakehouse]
                                           |
      +--------------------+---------------+--------------------+
      | Data Stream (DLO)  | Transform Map | Data Model Object (DMO)
      | S3 / Kafka / HTTP  | Streaming ETL | Harmonized CIM Model
      +--------------------+---------------+--------------------+
                                           |
                     [Identity Resolution & Unified Profile Engine]
                                           |
                     [Vector Embeddings & Calculated Insights]
                                           |
        +----------------------------------+----------------------------------+
        | CRM Real-Time Card Activation   | Segment Activation (Marketing)   |
        +----------------------------------+----------------------------------+
      `,
      highlights: [
        'Zero-copy architecture linking Snowflake and AWS S3 directly into Salesforce Data Cloud.',
        'Automated Identity Resolution rules uniting fragmented customer interactions across POS, web, and mobile apps into unified individuals.',
        'Sub-second calculated insights streamed directly onto Lightning record pages.'
      ],
      impact: 'Unified 4.2 million distinct customer identities, powering hyper-personalized real-time omnichannel recommendations.'
    },
    health: {
      title: 'Health Cloud FHIR Interoperability & Patient 360 Architecture',
      category: 'Life Sciences & Healthcare CRM',
      blueprint: `
+-----------------------------------------------------------------------------------------+
|               EHR Core (Epic / Cerner) <---> FHIR R4 REST API Endpoints                 |
+-----------------------------------------------------------------------------------------+
                                           |
                          [MuleSoft Healthcare Accelerator]
                                           |
                        [Salesforce Health Cloud Data Model]
                                           |
      +--------------------+---------------+--------------------+
      | Patient 360 Chart  | Care Plans &  | Telehealth / Remote|
      | (Allergies & Meds) | Team Assigned | Patient Monitoring |
      +--------------------+---------------+--------------------+
                                           |
                     [Patient Portal (Experience Cloud / Mobile)]
      `,
      highlights: [
        'Full adherence to HL7 FHIR v4 standards for bidirectional clinical records synchronization.',
        'Custom Care Plan orchestration tracking care gaps, medication adherence, and proactive appointment reminders.',
        'Rigorous HIPAA-compliant data segregation and field-level encryption for protected health information (PHI).'
      ],
      impact: 'Increased care plan compliance by 34% and reduced patient readmission rates by 22% within 6 months.'
    }
  };

  document.querySelectorAll('.view-arch-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const archKey = btn.getAttribute('data-arch') || 'ncino';
      const data = archBlueprints[archKey] || archBlueprints.ncino;

      modalTitle.textContent = data.title;
      modalCategory.textContent = data.category;
      modalBlueprint.textContent = data.blueprint;

      modalHighlights.innerHTML = data.highlights
        .map(h => `<li style="margin-bottom:8px;display:flex;align-items:center;gap:8px;"><span style="color:var(--sf-blue-brand);font-weight:700;">✦</span> ${h}</li>`)
        .join('');

      modalImpact.textContent = data.impact;

      modal.classList.add('active');
      document.body.style.overflow = 'hidden';
    });
  });

  closeBtn.addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
      closeModal();
    }
  });

  function closeModal() {
    modal.classList.remove('active');
    document.body.style.overflow = 'auto';
  }
}

/* ==========================================================================
   7. Contact & Free Org Audit Form
   ========================================================================== */
function initContactForm() {
  const form = document.getElementById('contact-form');
  const alertBox = document.getElementById('form-success-alert');

  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;

    submitBtn.disabled = true;
    submitBtn.innerHTML = '<span class="badge-pulse-dot" style="display:inline-block;margin-right:8px;"></span> Submitting Request...';

    setTimeout(() => {
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalText;
      form.reset();

      if (alertBox) {
        alertBox.style.display = 'block';
        alertBox.innerHTML = `
          <strong>Thank you! Your inquiry has been routed directly to Rahul Sharma, Yash Agrawal, Kirtesh Khandelwal & Mohnish Tak.</strong><br>
          An architect from Om Cloud Consulting will review your org requirements and respond within 24 business hours.
        `;
        alertBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    }, 1200);
  });
}

/* ==========================================================================
   8. Salesforce FAQ Accordion Blade
   ========================================================================== */
function initFaqAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const btn = item.querySelector('.faq-question');
    if (!btn) return;
    btn.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');
      faqItems.forEach(i => i.classList.remove('open'));
      if (!isOpen) {
        item.classList.add('open');
      }
    });
  });
}

/* ==========================================================================
   9. Mobile Navigation Drawer
   ========================================================================== */
function initMobileMenu() {
  const toggle = document.getElementById('mobile-toggle');
  const navLinks = document.querySelector('.nav-links');
  if (!toggle || !navLinks) return;

  toggle.addEventListener('click', () => {
    navLinks.classList.toggle('mobile-open');
  });

  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('mobile-open');
    });
  });
}

