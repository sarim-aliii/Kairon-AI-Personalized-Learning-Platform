import { Question } from "../../types"

export const securityQuestions: Question[] = [
    { id: 'sec_1', title: 'Explain XSS and how to prevent it', difficulty: 'Medium', link: 'https://owasp.org/www-community/attacks/xss/' },
    { id: 'sec_2', title: 'Symmetric vs Asymmetric Encryption', difficulty: 'Concept', link: 'https://www.cloudflare.com/learning/ssl/symmetric-asymmetric-encryption/' },
    { id: 'sec_3', title: 'What is CSRF?', difficulty: 'Medium', link: 'https://owasp.org/www-community/attacks/csrf' },
    { id: 'sec_4', title: 'Explain JWT structure and security', difficulty: 'Easy', link: 'https://jwt.io/introduction' },

    { id: 'sec_5', title: 'What is SQL Injection and how to prevent it?', difficulty: 'Medium', link: 'https://owasp.org/www-community/attacks/SQL_Injection' },
    { id: 'sec_6', title: 'Explain Clickjacking and frame busting', difficulty: 'Medium', link: 'https://owasp.org/www-community/attacks/Clickjacking' },
    { id: 'sec_7', title: 'CORS: What it is and common misconfigurations', difficulty: 'Medium', link: 'https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS' },
    { id: 'sec_8', title: 'What is HTTPS and TLS handshake?', difficulty: 'Concept', link: 'https://howhttps.works/' },
    { id: 'sec_9', title: 'Explain HTTP Security Headers (CSP, HSTS, X-Frame-Options)', difficulty: 'Medium', link: 'https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy' },
    { id: 'sec_10', title: 'SameSite cookies and secure cookie attributes', difficulty: 'Easy', link: 'https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Set-Cookie/SameSite' },

    { id: 'sec_11', title: 'Password Hashing: bcrypt, scrypt, Argon2', difficulty: 'Medium', link: 'https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html' },
    { id: 'sec_12', title: 'Salting vs Peppering passwords', difficulty: 'Medium', link: 'https://auth0.com/blog/adding-salt-to-hashing-a-better-way-to-store-passwords/' },
    { id: 'sec_13', title: 'Explain OAuth 2.0 Authorization Code Flow', difficulty: 'Medium', link: 'https://oauth.net/2/grant-types/authorization-code/' },
    { id: 'sec_14', title: 'OAuth2 vs OpenID Connect', difficulty: 'Concept', link: 'https://auth0.com/docs/authenticate/protocols/openid-connect-protocol' },
    { id: 'sec_15', title: 'Session-based Auth vs Token-based Auth', difficulty: 'Medium', link: 'https://auth0.com/blog/stateless-auth-for-stateful-minds/' },

    { id: 'sec_16', title: 'What is MFA (2FA) and why is it important?', difficulty: 'Easy', link: 'https://www.cloudflare.com/learning/access-management/what-is-mfa/' },
    { id: 'sec_17', title: 'Security risks of storing JWTs in localStorage', difficulty: 'Medium', link: 'https://auth0.com/blog/cookies-vs-tokens-definitive-guide/' },
    { id: 'sec_18', title: 'Explain Refresh Tokens and their security concerns', difficulty: 'Medium', link: 'https://auth0.com/docs/secure/tokens/refresh-tokens' },
    { id: 'sec_19', title: 'Explain Brute Force vs Credential Stuffing attacks', difficulty: 'Medium', link: 'https://owasp.org/www-community/attacks/Credential_stuffing' },
    { id: 'sec_20', title: 'Account Lockout and Rate Limiting for Login APIs', difficulty: 'Medium', link: 'https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html' },

    { id: 'sec_21', title: 'What is Man-in-the-Middle (MITM) attack?', difficulty: 'Easy', link: 'https://www.kaspersky.com/resource-center/definitions/man-in-the-middle-attack' },
    { id: 'sec_22', title: 'DNS Spoofing / Cache Poisoning basics', difficulty: 'Medium', link: 'https://www.cloudflare.com/learning/dns/dns-cache-poisoning/' },
    { id: 'sec_23', title: 'ARP Spoofing basics', difficulty: 'Medium', link: 'https://www.imperva.com/learn/application-security/arp-spoofing/' },
    { id: 'sec_24', title: 'What is SSL/TLS Certificate Pinning?', difficulty: 'Hard', link: 'https://owasp.org/www-community/controls/Certificate_and_Public_Key_Pinning' },
    { id: 'sec_25', title: 'Explain HSTS (HTTP Strict Transport Security)', difficulty: 'Medium', link: 'https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Strict-Transport-Security' },

    { id: 'sec_26', title: 'What is a VPN and how does it secure traffic?', difficulty: 'Easy', link: 'https://www.cloudflare.com/learning/vpn/what-is-a-vpn/' },
    { id: 'sec_27', title: 'Explain IPSec vs TLS VPN', difficulty: 'Medium', link: 'https://www.fortinet.com/resources/cyberglossary/ipsec-vpn' },
    { id: 'sec_28', title: 'Explain Zero Trust Security model', difficulty: 'Concept', link: 'https://www.nist.gov/publications/zero-trust-architecture' },
    { id: 'sec_29', title: 'Network Segmentation and its benefits', difficulty: 'Medium', link: 'https://www.cisa.gov/sites/default/files/publications/Guidelines_for_Network_Segmentation_508C.pdf' },
    { id: 'sec_30', title: 'Firewalls: Stateful vs Stateless', difficulty: 'Medium', link: 'https://www.cloudflare.com/learning/ddos/glossary/stateful-firewall/' },

    { id: 'sec_31', title: 'Explain WAF (Web Application Firewall)', difficulty: 'Medium', link: 'https://www.cloudflare.com/learning/ddos/what-is-a-web-application-firewall-waf/' },
    { id: 'sec_32', title: 'What is IDS/IPS?', difficulty: 'Medium', link: 'https://www.cisco.com/c/en/us/products/security/what-is-an-ids-ips.html' },
    { id: 'sec_33', title: 'Explain DDoS attacks and basic mitigations', difficulty: 'Medium', link: 'https://www.cloudflare.com/learning/ddos/what-is-a-ddos-attack/' },
    { id: 'sec_34', title: 'Explain Rate Limiting as a protection technique', difficulty: 'Easy', link: 'https://cloudflare.com/learning/bots/what-is-rate-limiting/' },
    { id: 'sec_35', title: 'Explain Bot Detection and CAPTCHAs', difficulty: 'Medium', link: 'https://www.cloudflare.com/learning/bots/what-is-a-captcha/' },

    { id: 'sec_36', title: 'Explain Insecure Direct Object References (IDOR)', difficulty: 'Medium', link: 'https://owasp.org/www-community/attacks/IDOR' },
    { id: 'sec_37', title: 'Explain Broken Access Control', difficulty: 'Medium', link: 'https://owasp.org/Top10/A01_2021-Broken_Access_Control/' },
    { id: 'sec_38', title: 'Explain Security Misconfiguration', difficulty: 'Medium', link: 'https://owasp.org/Top10/A05_2021-Security_Misconfiguration/' },
    { id: 'sec_39', title: 'Explain Sensitive Data Exposure', difficulty: 'Medium', link: 'https://owasp.org/Top10/A02_2021-Cryptographic_Failures/' },
    { id: 'sec_40', title: 'Explain Broken Authentication', difficulty: 'Medium', link: 'https://owasp.org/Top10/A07_2021-Identification_and_Authentication_Failures/' },

    { id: 'sec_41', title: 'Explain SSRF (Server-Side Request Forgery)', difficulty: 'Hard', link: 'https://owasp.org/Top10/A10_2021-Server-Side_Request_Forgery_%28SSRF%29/' },
    { id: 'sec_42', title: 'Explain XXE (XML External Entity) attacks', difficulty: 'Hard', link: 'https://owasp.org/www-community/vulnerabilities/XML_External_Entity_(XXE)_Processing' },
    { id: 'sec_43', title: 'Explain Directory Traversal / Path Traversal', difficulty: 'Medium', link: 'https://owasp.org/www-community/attacks/Path_Traversal' },
    { id: 'sec_44', title: 'Explain Command Injection', difficulty: 'Hard', link: 'https://owasp.org/www-community/attacks/Command_Injection' },
    { id: 'sec_45', title: 'Explain Deserialization vulnerabilities', difficulty: 'Hard', link: 'https://owasp.org/www-community/vulnerabilities/Deserialization_of_untrusted_data' },

    { id: 'sec_46', title: 'Explain Principle of Least Privilege', difficulty: 'Concept', link: 'https://csrc.nist.gov/glossary/term/least_privilege' },
    { id: 'sec_47', title: 'Defense in Depth: what and why?', difficulty: 'Concept', link: 'https://csrc.nist.gov/glossary/term/defense_in_depth' },
    { id: 'sec_48', title: 'Security by Design vs Security by Obscurity', difficulty: 'Concept', link: 'https://owasp.org/www-community/controls/Security_by_Design_Principles' },
    { id: 'sec_49', title: 'Explain Threat Modeling (STRIDE)', difficulty: 'Hard', link: 'https://learn.microsoft.com/en-us/azure/security/develop/threat-modeling-tool-threats' },
    { id: 'sec_50', title: 'Explain Security Risk = Likelihood × Impact', difficulty: 'Concept', link: 'https://owasp.org/www-project-risk-rating-methodology/' },

    { id: 'sec_51', title: 'What is a CVE and CVSS score?', difficulty: 'Medium', link: 'https://www.first.org/cvss/' },
    { id: 'sec_52', title: 'Patch Management and Vulnerability Scanning', difficulty: 'Medium', link: 'https://www.cisa.gov/resources-tools/resources/securing-open-source-software-patching' },
    { id: 'sec_53', title: 'Explain the OWASP Top 10', difficulty: 'Concept', link: 'https://owasp.org/www-project-top-ten/' },
    { id: 'sec_54', title: 'Static vs Dynamic Application Security Testing (SAST vs DAST)', difficulty: 'Medium', link: 'https://owasp.org/www-community/Source_Code_Analysis_Tools' },
    { id: 'sec_55', title: 'Software Composition Analysis (SCA) and SBOMs', difficulty: 'Medium', link: 'https://www.cisa.gov/sbom' },

    { id: 'sec_56', title: 'Explain Supply Chain Attacks (e.g., dependency hijacking)', difficulty: 'Hard', link: 'https://www.cisa.gov/supply-chain-compromise' },
    { id: 'sec_57', title: 'Secure SDLC: integrating security into dev lifecycle', difficulty: 'Hard', link: 'https://owasp.org/www-project-samm/' },
    { id: 'sec_58', title: 'DevSecOps: shifting security left', difficulty: 'Concept', link: 'https://snyk.io/learn/what-is-devsecops/' },
    { id: 'sec_59', title: 'Security Code Review Basics', difficulty: 'Medium', link: 'https://owasp.org/www-project-code-review-guide/' },
    { id: 'sec_60', title: 'Principles of Secure Coding (input validation, output encoding)', difficulty: 'Medium', link: 'https://cheatsheetseries.owasp.org/IndexTopTen.html' },

    { id: 'sec_61', title: 'Explain Public Key Infrastructure (PKI)', difficulty: 'Hard', link: 'https://www.cloudflare.com/learning/ssl/what-is-public-key-infrastructure/' },
    { id: 'sec_62', title: 'Digital Signatures vs Certificates', difficulty: 'Medium', link: 'https://www.ssl.com/faqs/faq-what-is-a-digital-certificate/' },
    { id: 'sec_63', title: 'Hash functions: SHA-256, collisions, preimage resistance', difficulty: 'Medium', link: 'https://csrc.nist.gov/projects/hash-functions' },
    { id: 'sec_64', title: 'Explain HMAC and its use cases', difficulty: 'Medium', link: 'https://www.rfc-editor.org/rfc/rfc2104' },
    { id: 'sec_65', title: 'Explain Key Exchange (Diffie–Hellman)', difficulty: 'Hard', link: 'https://www.cloudflare.com/learning/ssl/what-is-diffie-hellman/' },

    { id: 'sec_66', title: 'Explain Password Policies and NIST recommendations', difficulty: 'Medium', link: 'https://pages.nist.gov/800-63-3/sp800-63b.html' },
    { id: 'sec_67', title: 'Account Recovery and Security Pitfalls', difficulty: 'Medium', link: 'https://cheatsheetseries.owasp.org/cheatsheets/Forgot_Password_Cheat_Sheet.html' },
    { id: 'sec_68', title: 'Explain Social Engineering (phishing, spear-phishing)', difficulty: 'Easy', link: 'https://www.cisa.gov/news-events/news/avoiding-social-engineering-and-phishing-attacks' },
    { id: 'sec_69', title: 'Insider Threats and Least Privilege', difficulty: 'Medium', link: 'https://www.cisa.gov/topics/insider-threat-mitigation' },
    { id: 'sec_70', title: 'Security Awareness Training for developers and staff', difficulty: 'Concept', link: 'https://owasp.org/www-project-proactive-controls/' },

    { id: 'sec_71', title: 'Explain Mobile App Security Basics (OWASP MASVS)', difficulty: 'Hard', link: 'https://mas.owasp.org/' },
    { id: 'sec_72', title: 'Explain API Security (OWASP API Top 10)', difficulty: 'Hard', link: 'https://owasp.org/www-project-api-security/' },
    { id: 'sec_73', title: 'Explain CORS-related vulnerabilities', difficulty: 'Medium', link: 'https://portswigger.net/web-security/cors' },
    { id: 'sec_74', title: 'Explain HTTP parameter pollution', difficulty: 'Hard', link: 'https://owasp.org/www-community/attacks/Parameter_pollution' },
    { id: 'sec_75', title: 'Explain Subdomain Takeover', difficulty: 'Hard', link: 'https://hackerone.com/reports/202000' },

    { id: 'sec_76', title: 'Explain Cloud Security Shared Responsibility Model', difficulty: 'Concept', link: 'https://aws.amazon.com/compliance/shared-responsibility-model/' },
    { id: 'sec_77', title: 'S3/Blob Storage public access misconfigurations', difficulty: 'Medium', link: 'https://docs.aws.amazon.com/AmazonS3/latest/userguide/access-control-block-public-access.html' },
    { id: 'sec_78', title: 'IAM Best Practices in Cloud', difficulty: 'Medium', link: 'https://docs.aws.amazon.com/IAM/latest/UserGuide/best-practices.html' },
    { id: 'sec_79', title: 'Kubernetes Security Basics (RBAC, PSP/PSS)', difficulty: 'Hard', link: 'https://kubernetes.io/docs/concepts/security/overview/' },
    { id: 'sec_80', title: 'Secrets Management in Cloud (KMS, Vault)', difficulty: 'Medium', link: 'https://developer.hashicorp.com/vault/docs/use-cases' },

    { id: 'sec_81', title: 'Explain Logging and Audit Trails for Security', difficulty: 'Medium', link: 'https://owasp.org/www-project-logging-cheat-sheet/' },
    { id: 'sec_82', title: 'Explain SIEM (Security Information and Event Management)', difficulty: 'Concept', link: 'https://www.splunk.com/en_us/data-insider/what-is-siem.html' },
    { id: 'sec_83', title: 'Incident Response Lifecycle (NIST)', difficulty: 'Hard', link: 'https://csrc.nist.gov/publications/detail/sp/800-61/rev-2/final' },
    { id: 'sec_84', title: 'Explain Security Incident vs Event vs Alert', difficulty: 'Concept', link: 'https://www.crowdstrike.com/cybersecurity-101/cybersecurity-incident/' },
    { id: 'sec_85', title: 'Data Retention and Log Privacy concerns', difficulty: 'Medium', link: 'https://www.cnil.fr/en/data-retention-what-are-rules' },

    { id: 'sec_86', title: 'Explain GDPR basics for developers', difficulty: 'Medium', link: 'https://gdpr.eu/what-is-gdpr/' },
    { id: 'sec_87', title: 'Explain PCI-DSS basics for handling card data', difficulty: 'Hard', link: 'https://www.pcisecuritystandards.org/pci_security/' },
    { id: 'sec_88', title: 'Explain HIPAA basics for healthcare apps', difficulty: 'Hard', link: 'https://www.hhs.gov/hipaa/for-professionals/security/index.html' },
    { id: 'sec_89', title: 'Explain Data Anonymization vs Pseudonymization', difficulty: 'Medium', link: 'https://gdpr.eu/anonymization-pseudonymization/' },
    { id: 'sec_90', title: 'Explain Privacy by Design and by Default', difficulty: 'Concept', link: 'https://gdpr-info.eu/art-25-gdpr/' },

    { id: 'sec_91', title: 'Explain Threat Intelligence Feeds and IOC', difficulty: 'Hard', link: 'https://www.cisa.gov/topics/cyber-threats-and-advisories' },
    { id: 'sec_92', title: 'Explain API Keys vs OAuth tokens vs Client Certificates', difficulty: 'Medium', link: 'https://cloud.google.com/endpoints/docs/openapi/when-why-api-key' },
    { id: 'sec_93', title: 'Explain Secure File Upload handling', difficulty: 'Medium', link: 'https://cheatsheetseries.owasp.org/cheatsheets/File_Upload_Cheat_Sheet.html' },
    { id: 'sec_94', title: 'Explain Logging of Sensitive Data (PII masking)', difficulty: 'Medium', link: 'https://owasp.org/www-community/controls/Logging_Sensitive_Information' },
    { id: 'sec_95', title: 'Explain Security Hardening of Linux servers', difficulty: 'Hard', link: 'https://www.cisecurity.org/benchmark/linux' },

    { id: 'sec_96', title: 'Client-side vs Server-side Validation from security view', difficulty: 'Easy', link: 'https://cheatsheetseries.owasp.org/cheatsheets/Input_Validation_Cheat_Sheet.html' },
    { id: 'sec_97', title: 'Explain HTTP-only, Secure, and SameSite cookie flags', difficulty: 'Easy', link: 'https://developer.mozilla.org/en-US/docs/Web/HTTP/Cookies' },
    { id: 'sec_98', title: 'Explain CSP (Content Security Policy) for XSS Mitigation', difficulty: 'Medium', link: 'https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP' },
    { id: 'sec_99', title: 'Explain Subresource Integrity (SRI)', difficulty: 'Medium', link: 'https://developer.mozilla.org/en-US/docs/Web/Security/Subresource_Integrity' },
    { id: 'sec_100', title: 'How would you design security for a new web app end-to-end?', difficulty: 'Hard', link: 'https://owasp.org/www-project-proactive-controls/' },
]

// ========================= 1) SECURITY FUNDAMENTALS (Easy + Concept) =========================
export const securityFundamentals: Question[] = securityQuestions.filter(q =>
  ['Easy', 'Concept'].includes(q.difficulty)
);

// ========================= 2) ADVANCED APP / PLATFORM SECURITY (Mostly Medium) =========================
export const securityAdvanced: Question[] = securityQuestions.filter(q =>
  q.difficulty === 'Medium'
);

// ========================= 3) SYSTEM, ARCHITECTURE & DEEP SECURITY (Hard) =========================
export const securitySystemAndArchitecture: Question[] = securityQuestions.filter(q =>
  q.difficulty === 'Hard'
);