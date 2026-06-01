# Cleopatra Compliance & Ethical Usage Policy

## ⚖️ Legal Disclaimer
Cleopatra is a powerful intelligence-gathering tool. The developers and contributors are not responsible for any misuse, damage, or legal consequences resulting from the use of this software. By deploying or utilizing this platform, you assume full responsibility for ensuring your actions comply with all applicable local, national, and international laws.

## 🛡️ Ethical Usage Mandate
Cleopatra must be used strictly for **authorized defensive monitoring, security research, and educational purposes**. Prohibited activities include but are not limited to:
1. **Unauthorized Surveillance**: Monitoring individuals or entities without explicit legal authority or consent.
2. **Malicious Exploitation**: Using identified data leakages or derogatory records for blackmail, harassment, or social engineering.
3. **Data Harvesting**: Bulk extraction of personal data for commercial sale or unauthorized databases.
4. **Service Disruption**: Using the scanner or crawler modules to perform Denial of Service (DDoS) attacks against government or private infrastructure.

## 🔒 Data Privacy & PII
Cleopatra interacts with highly sensitive Personally Identifiable Information (PII), including SSS, Philhealth, and Pag-ibig records. 
- **Encryption**: All sensitive data cached in the Rust backend must be encrypted at rest.
- **Zero-Persistence**: By default, Cleopatra is designed for real-time analysis. Permanent storage of sensitive PII is discouraged unless explicitly required by a secured mission profile.
- **Local Control**: All data fetched remains within your controlled environment (e.g., your Docker instance). No data is transmitted back to the developers.

## 📡 Operational Security (OPSEC)
To ensure compliance with remote system integrity:
- **Respectful Crawling**: The system utilizes `stealthFetch` to rotate headers and avoid overwhelming target servers.
- **Rate Limiting**: Integrated rate limiters prevent the tool from being used as a high-volume scanner, ensuring it remains within the bounds of standard reconnaissance.
- **Robots.txt**: Crawlers should be configured to respect the `robots.txt` of government agency websites where applicable.

## 🌍 Jurisdictional Compliance
Users are reminded that OSINT activities are governed by varying laws globally:
- **GDPR (Europe)**: The "Right to be Forgotten" and strict processing rules for PII.
- **CFAA (USA)**: Anti-hacking statutes regarding unauthorized access to protected computers.
- **Cybercrime Prevention Act (Philippines)**: Specific regulations regarding the access and use of government data and personal information.

## 🚨 Responsible Disclosure
If you discover a security vulnerability within the Cleopatra platform itself, please report it via the project's secure communication channels rather than publicizing it. We aim to maintain a high level of system integrity for all legitimate users.
