# LearnBloc

**LearnBloc** is a decentralized education platform built on the Stacks blockchain using Clarity smart contracts. It enables learners to earn on-chain credentials, educators to monetize modular courses, and employers to verify skills instantly — all while incentivizing quality participation through token rewards and reputation.

---

## 🧠 Problem

Traditional education suffers from:
- Credential fraud
- Centralized gatekeeping
- Lack of verifiable microlearning
- Weak incentives for learners and educators

---

## 🚀 Solution

LearnBloc provides:
- **On-chain Credentials (NFTs)** issued after course completion
- **Token Rewards** for learners, educators, and referrers
- **Staking** to unlock premium content or vouch for quality
- **Reputation System** for trust and transparency
- **DAO Governance** to maintain standards

---

## 🛠️ Tech Stack

- **Smart Contracts:** Clarity (Stacks blockchain)
- **Frontend:** React + Stacks.js (or Hiro Wallet)
- **Storage:** IPFS / Gaia for course content
- **Wallet Integration:** Hiro Wallet

---

## 📦 Smart Contracts

| Contract                | Purpose                                                      |
|-------------------------|--------------------------------------------------------------|
| `user-profile.clar`     | Manages learner and educator profiles                        |
| `course-registry.clar`  | Registers and manages micro-courses                          |
| `enrollment.clar`       | Handles enrollments, fees, and refund conditions             |
| `progress-tracker.clar` | Tracks learner progress and milestone completions            |
| `credential-nft.clar`   | Issues NFTs as proof of course completion                    |
| `reward-token.clar`     | Distributes native token rewards                             |
| `staking.clar`          | Allows users to stake tokens for content or course backing   |
| `reputation.clar`       | Maintains user reputation based on reviews and outcomes      |
| `dao.clar` *(optional)* | Enables token-holder voting on platform upgrades             |
| `split-payments.clar`   | Distributes fees among stakeholders                          |

---

## Local Development

```bash
git clone https://github.com/your-username/learnbloc.git
cd learnbloc
npm install
cd learnbloc/contracts
clarinet check
npm run test
```