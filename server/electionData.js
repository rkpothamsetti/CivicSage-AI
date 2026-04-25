/**
 * Comprehensive Indian Election Process Knowledge Base
 * Source: Election Commission of India (ECI)
 * Used to ground Gemini AI responses with authoritative data.
 */

export const SYSTEM_PROMPT = `You are CivicSage AI, an expert interactive assistant specializing in the Indian election process and civic education. You were created to help citizens understand democracy in India.

## Your Role
- You explain the Indian election process in a clear, engaging, and educational manner.
- You break down complex electoral timelines, procedures, and systems into simple, conversational explanations.
- You are non-partisan — you NEVER endorse, criticize, or comment on any political party, candidate, or ideology.
- You always reference official sources like the Election Commission of India (ECI).

## Your Knowledge Base (India-Specific)
You have deep knowledge of:

### Election Commission of India (ECI)
- Constitutional body under Article 324
- Headed by the Chief Election Commissioner (CEC) and Election Commissioners
- Responsible for conducting free and fair elections to Parliament, State Legislatures, and offices of President & Vice President
- Has the power to enforce the Model Code of Conduct

### Types of Elections in India
1. **General Elections (Lok Sabha)**: Held every 5 years to elect 543 members of Parliament
2. **State Assembly Elections (Vidhan Sabha)**: Held every 5 years for state legislatures
3. **By-Elections**: Held to fill vacancies arising between general elections
4. **Local Body Elections**: Panchayat and Municipal elections (conducted by State Election Commissions)
5. **Presidential & Vice-Presidential Elections**: Indirect elections by elected members

### The Election Process (8 Phases)

**Phase 1: Delimitation**
- Delimitation Commission redraws constituency boundaries based on census data
- Ensures equal representation across constituencies
- Done by an independent Delimitation Commission

**Phase 2: Election Announcement & Notification**
- ECI announces the election schedule
- Model Code of Conduct (MCC) comes into effect immediately
- Formal notification (Gazette notification) is issued
- MCC restricts government from announcing new policies, projects, or transfers

**Phase 3: Nomination**
- Candidates file nomination papers with the Returning Officer (RO)
- Must submit affidavits declaring criminal cases, assets, liabilities, and educational qualifications
- Security deposit: ₹25,000 for general candidates, ₹12,500 for SC/ST candidates (Lok Sabha)
- Independent candidates need proposers from the constituency

**Phase 4: Scrutiny of Nominations**
- Returning Officer examines all nomination papers
- Checks for eligibility (age, citizenship, disqualifications under RPA 1951)
- Invalid nominations are rejected with reasons

**Phase 5: Withdrawal of Candidature**
- Candidates can withdraw nominations before the deadline
- Final list of contesting candidates is published
- Symbols are allocated to candidates (by ECI for recognized parties, from free symbols list for independents)

**Phase 6: Election Campaign**
- Political parties and candidates campaign through rallies, advertisements, social media
- Campaign must stop 48 hours before polling day ("silent period")
- Expenditure limits: ₹95 lakh for Lok Sabha, ₹40 lakh for State Assembly (2024)
- No appeals to religion, caste, or community for votes (Section 123, RPA 1951)

**Phase 7: Polling Day**
- Voting using Electronic Voting Machines (EVMs) with Voter Verifiable Paper Audit Trail (VVPAT)
- Voter verification through Electoral Photo Identity Card (EPIC) or approved ID documents
- Indelible ink applied to left index finger
- Booth Level Officers (BLOs), Presiding Officers, and Polling Officers manage the process
- Mock polls conducted before actual voting begins
- Voting hours typically 7 AM to 6 PM
- NOTA (None of the Above) option available since 2013

**Phase 8: Counting & Results**
- EVMs stored in sealed strongrooms under 24/7 security
- Counting happens on designated day, observed by candidates/agents
- Postal ballots counted first
- EVM votes counted round by round
- Mandatory VVPAT verification of 5 randomly selected polling stations per constituency
- Returning Officer declares the winner
- Results published on ECI website (results.eci.gov.in)

### Key Concepts
- **EVM (Electronic Voting Machine)**: Standalone, battery-operated, tamper-proof device. Has Ballot Unit + Control Unit
- **VVPAT**: Prints a paper slip showing the symbol voted for, visible for 7 seconds, then drops into sealed box
- **Model Code of Conduct (MCC)**: Voluntary code with 8 sections covering general conduct, meetings, processions, polling day, polling booths, observers, party in power, and election manifestos
- **SVEEP**: Systematic Voters' Education and Electoral Participation — ECI's flagship voter awareness program
- **EPIC**: Elector's Photo Identity Card (Voter ID)
- **Electoral Roll**: List of all registered voters, revised annually
- **NOTA**: None of the Above — allows voters to reject all candidates
- **Postal Ballot**: For service voters, special voters, and senior citizens/PwD (above 80 years)

### Voter Registration
- Eligibility: Indian citizen, 18+ years on qualifying date
- Forms: Form 6 (new registration), Form 6A (overseas), Form 7 (objection), Form 8 (correction/shifting)
- Online registration: voters.eci.gov.in or Voter Helpline App
- Qualifying dates: January 1, April 1, July 1, October 1

### Important Constitutional Articles
- Article 324: Superintendence, direction, and control of elections
- Article 325: No person ineligible for electoral roll on grounds of religion, race, caste, or sex
- Article 326: Universal adult suffrage (18+)
- Article 327: Parliament's power to make laws regarding elections
- Article 329: Bar to interference by courts in electoral matters

## Response Guidelines
1. Always be factual, citing ECI data and constitutional provisions where relevant
2. Use simple language — explain complex terms when first used
3. Format responses with bullet points, numbered lists, and bold text for key terms
4. If asked about something outside Indian elections, politely redirect to Indian election topics
5. If asked for political opinions or party preferences, firmly decline and explain your non-partisan role
6. Suggest related topics the user might want to explore next
7. Use examples and analogies to make concepts relatable
8. When discussing timelines, be specific about durations and deadlines`;

export const ELECTION_TIMELINE = [
  {
    id: 1,
    phase: 'Delimitation',
    title: 'Constituency Boundaries',
    icon: '🗺️',
    duration: 'Periodic (after Census)',
    description: 'Redrawing of constituency boundaries by the Delimitation Commission to ensure equal representation based on the latest census data.',
    keyFacts: [
      'Done by an independent Delimitation Commission',
      'Based on latest census population data',
      'Ensures roughly equal voter population per constituency',
      'Last major delimitation was based on 2001 Census',
    ],
    color: '#7c3aed',
  },
  {
    id: 2,
    phase: 'Announcement',
    title: 'Election Schedule & Notification',
    icon: '📢',
    duration: '~45 days before polling',
    description: 'The Election Commission announces the election dates and the Model Code of Conduct comes into effect immediately.',
    keyFacts: [
      'Model Code of Conduct (MCC) begins immediately',
      'Government cannot announce new schemes or policies',
      'Transfer of officials prohibited without ECI approval',
      'Formal gazette notification issued for each constituency',
    ],
    color: '#2563eb',
  },
  {
    id: 3,
    phase: 'Nomination',
    title: 'Filing of Nominations',
    icon: '📝',
    duration: '~7 days after notification',
    description: 'Candidates file their nomination papers with the Returning Officer, including affidavits declaring criminal cases, assets, and qualifications.',
    keyFacts: [
      'Security deposit: ₹25,000 (General) / ₹12,500 (SC/ST) for Lok Sabha',
      'Must file affidavit of assets, criminal cases, education',
      'Proposers needed for independent candidates',
      'Multiple nominations can be filed (max 4)',
    ],
    color: '#059669',
  },
  {
    id: 4,
    phase: 'Scrutiny',
    title: 'Scrutiny of Nominations',
    icon: '🔍',
    duration: '1 day after last nomination date',
    description: 'The Returning Officer examines all nomination papers for eligibility requirements and rejects invalid nominations.',
    keyFacts: [
      'Returning Officer checks age, citizenship, disqualifications',
      'Verified under Representation of the People Act, 1951',
      'Rejected candidates can appeal',
      'Candidates/agents can raise objections',
    ],
    color: '#d97706',
  },
  {
    id: 5,
    phase: 'Withdrawal',
    title: 'Withdrawal of Candidature',
    icon: '↩️',
    duration: '2 days after scrutiny',
    description: 'Candidates may withdraw their nominations. After the deadline, the final list of contesting candidates is published.',
    keyFacts: [
      'Withdrawal is final and irrevocable',
      'Final candidate list published after deadline',
      'Election symbols allocated by ECI',
      'If only 1 candidate remains, declared elected unopposed',
    ],
    color: '#dc2626',
  },
  {
    id: 6,
    phase: 'Campaign',
    title: 'Election Campaign Period',
    icon: '📣',
    duration: '~2-3 weeks (ends 48h before polling)',
    description: 'Political parties and candidates campaign through rallies, media, and social media. Campaign must stop 48 hours before polling.',
    keyFacts: [
      'Must stop 48 hours before polling day ("silence period")',
      'Expenditure limit: ₹95 lakh (Lok Sabha), ₹40 lakh (Assembly)',
      'No appeals to religion, caste, or communal feelings',
      'All expenses must be reported to ECI observers',
    ],
    color: '#7c3aed',
  },
  {
    id: 7,
    phase: 'Polling',
    title: 'Voting Day',
    icon: '🗳️',
    duration: '1 day (7 AM - 6 PM typically)',
    description: 'Citizens cast their votes using EVMs with VVPAT verification. Identity verified, indelible ink applied, and vote recorded securely.',
    keyFacts: [
      'Electronic Voting Machines (EVMs) with VVPAT used',
      'Voter identity verified through EPIC or approved IDs',
      'Indelible ink on left index finger prevents repeat voting',
      'NOTA option available since 2013',
      'Mock polls conducted before actual voting',
      'Declared public holiday for voter convenience',
    ],
    color: '#2563eb',
  },
  {
    id: 8,
    phase: 'Counting',
    title: 'Vote Counting & Results',
    icon: '📊',
    duration: '1-2 days after final polling phase',
    description: 'EVMs are unsealed and counted round by round. VVPAT slips verified for randomly selected booths. Results declared by the Returning Officer.',
    keyFacts: [
      'EVMs stored in sealed strongrooms with 24/7 security',
      'Postal ballots counted first',
      'Votes counted in rounds, results displayed per round',
      'Mandatory VVPAT verification of 5 random booths per constituency',
      'Results published on results.eci.gov.in',
      'Winner declared by Returning Officer',
    ],
    color: '#059669',
  },
];

export const QUIZ_QUESTIONS = [
  {
    id: 1,
    question: 'What is the minimum age to vote in Indian elections?',
    options: ['16 years', '18 years', '21 years', '25 years'],
    correct: 1,
    explanation: 'Under Article 326 of the Indian Constitution, every citizen who is 18 years or older on the qualifying date is entitled to vote. The voting age was reduced from 21 to 18 by the 61st Constitutional Amendment Act, 1988.',
  },
  {
    id: 2,
    question: 'Which constitutional article gives the Election Commission the power to conduct elections?',
    options: ['Article 14', 'Article 21', 'Article 324', 'Article 370'],
    correct: 2,
    explanation: 'Article 324 of the Indian Constitution vests the superintendence, direction, and control of elections in the Election Commission of India.',
  },
  {
    id: 3,
    question: 'What does VVPAT stand for?',
    options: [
      'Voter Verified Paper Audit Trail',
      'Voter Validation Paper Authentication Trail',
      'Vote Verification and Paper Audit Technology',
      'Voter Verifiable Paper Audit Trail',
    ],
    correct: 3,
    explanation: 'VVPAT stands for Voter Verifiable Paper Audit Trail. It is an independent verification system attached to EVMs that allows voters to verify their vote through a printed paper slip.',
  },
  {
    id: 4,
    question: 'When does the Model Code of Conduct come into effect?',
    options: [
      'On the day of polling',
      'When the election schedule is announced',
      '48 hours before polling',
      'When nomination filing begins',
    ],
    correct: 1,
    explanation: 'The Model Code of Conduct comes into effect immediately when the Election Commission announces the election schedule, and remains in force until the results are declared.',
  },
  {
    id: 5,
    question: 'How many members are elected to the Lok Sabha?',
    options: ['500', '543', '545', '552'],
    correct: 1,
    explanation: 'The Lok Sabha has 543 elected members. Earlier, 2 members were nominated by the President from the Anglo-Indian community, but this provision was discontinued by the 104th Constitutional Amendment Act, 2019.',
  },
  {
    id: 6,
    question: 'What is the security deposit for a general candidate in Lok Sabha elections?',
    options: ['₹10,000', '₹15,000', '₹25,000', '₹50,000'],
    correct: 2,
    explanation: 'A general candidate must deposit ₹25,000 as security deposit for Lok Sabha elections. For SC/ST candidates, the amount is ₹12,500. The deposit is forfeited if the candidate fails to secure 1/6th of valid votes.',
  },
  {
    id: 7,
    question: 'When must election campaigning stop before polling day?',
    options: ['24 hours', '48 hours', '72 hours', '12 hours'],
    correct: 1,
    explanation: 'Election campaigning must stop 48 hours before the polling day. This "silence period" is meant to give voters time to make their decision without last-minute influence.',
  },
  {
    id: 8,
    question: 'What is NOTA in Indian elections?',
    options: [
      'National Organization for Transparent Administration',
      'None of the Above',
      'New Online Tracking Application',
      'Notification of Transfer Authority',
    ],
    correct: 1,
    explanation: 'NOTA (None of the Above) is an option on the EVM ballot that allows voters to officially reject all candidates. It was introduced by the Supreme Court in September 2013.',
  },
  {
    id: 9,
    question: 'Which form is used for new voter registration?',
    options: ['Form 2', 'Form 6', 'Form 8', 'Form 11'],
    correct: 1,
    explanation: 'Form 6 is used for new voter registration in India. Form 6A is for overseas (NRI) voters, Form 7 is for objection to inclusion of names, and Form 8 is for correction of entries or transposition.',
  },
  {
    id: 10,
    question: 'What does SVEEP stand for?',
    options: [
      'State Voter Education and Election Program',
      'Systematic Voters Education and Electoral Participation',
      'Strategic Voter Engagement and Empowerment Program',
      'Standard Voter Enrollment and Education Process',
    ],
    correct: 1,
    explanation: 'SVEEP stands for Systematic Voters\' Education and Electoral Participation. It is the flagship program of ECI for voter education, awareness, and participation.',
  },
  {
    id: 11,
    question: 'How many VVPAT slips are mandatorily verified per constituency?',
    options: ['1', '3', '5', '10'],
    correct: 2,
    explanation: 'The Supreme Court of India mandated that VVPAT slips from 5 randomly selected polling stations per assembly constituency must be matched with the EVM count.',
  },
  {
    id: 12,
    question: 'Which ink is used to mark voters during elections?',
    options: ['Permanent marker ink', 'Indelible ink', 'Stamp ink', 'Silver nitrate ink'],
    correct: 1,
    explanation: 'Indelible ink (containing silver nitrate) is applied to the left index finger of voters. It is manufactured exclusively by Mysore Paints and Varnish Ltd., a Karnataka government undertaking.',
  },
  {
    id: 13,
    question: 'What is the expenditure limit for a Lok Sabha candidate?',
    options: ['₹40 lakh', '₹70 lakh', '₹95 lakh', '₹1 crore'],
    correct: 2,
    explanation: 'The election expenditure limit for a Lok Sabha candidate is ₹95 lakh (in most states). For state assembly elections, it is ₹40 lakh. These limits were revised by ECI in 2022.',
  },
  {
    id: 14,
    question: 'Which amendment reduced the voting age from 21 to 18 years?',
    options: ['59th Amendment', '61st Amendment', '73rd Amendment', '42nd Amendment'],
    correct: 1,
    explanation: 'The 61st Constitutional Amendment Act of 1988 reduced the minimum voting age from 21 to 18 years, effective from the 1989 general elections.',
  },
  {
    id: 15,
    question: 'The Election Commission of India is a:',
    options: [
      'Legislative body',
      'Judicial body',
      'Constitutional body',
      'Statutory body',
    ],
    correct: 2,
    explanation: 'The Election Commission of India is a constitutional body established under Article 324 of the Constitution. It is not created by any statute/law of Parliament but directly by the Constitution itself.',
  },
];

export const SUGGESTED_PROMPTS = [
  '🗳️ How does voting work in India?',
  '📋 How can I register as a voter?',
  '🖥️ What is an EVM and how does it work?',
  '📜 Explain the Model Code of Conduct',
  '📊 How are votes counted?',
  '🔍 What is VVPAT verification?',
  '🇮🇳 What are the types of elections in India?',
  '⏱️ What is the election timeline?',
];

export const PROCESS_TOPICS = [
  {
    id: 'voter-registration',
    icon: '📋',
    title: 'Voter Registration',
    description: 'Learn how to register, check status, and understand eligibility requirements for voting in Indian elections.',
    color: '#7c3aed',
  },
  {
    id: 'evm-voting',
    icon: '🖥️',
    title: 'EVM & VVPAT',
    description: 'Understand Electronic Voting Machines and the paper audit trail system that ensures vote integrity.',
    color: '#2563eb',
  },
  {
    id: 'model-code',
    icon: '⚖️',
    title: 'Model Code of Conduct',
    description: 'The rules that govern political parties and candidates during the election period.',
    color: '#059669',
  },
  {
    id: 'counting',
    icon: '📊',
    title: 'Vote Counting',
    description: 'How are millions of votes counted, verified, and results declared across the country.',
    color: '#d97706',
  },
  {
    id: 'eci',
    icon: '🏛️',
    title: 'Election Commission',
    description: 'The constitutional body that conducts and supervises all elections in India.',
    color: '#dc2626',
  },
  {
    id: 'types',
    icon: '🗳️',
    title: 'Types of Elections',
    description: 'From Lok Sabha to Panchayat — understand the different levels of elections in India.',
    color: '#7c3aed',
  },
  {
    id: 'rights',
    icon: '✊',
    title: 'Voter Rights',
    description: 'Know your fundamental rights as a voter, including the right to vote, NOTA, and grievance redressal.',
    color: '#2563eb',
  },
  {
    id: 'sveep',
    icon: '📚',
    title: 'SVEEP Program',
    description: 'Systematic Voters\' Education and Electoral Participation — ECI\'s voter awareness initiative.',
    color: '#059669',
  },
];

export const SUPPORTED_LANGUAGES = [
  { code: 'en', name: 'English', nativeName: 'English' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी' },
  { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்' },
  { code: 'te', name: 'Telugu', nativeName: 'తెలుగు' },
  { code: 'bn', name: 'Bengali', nativeName: 'বাংলা' },
  { code: 'mr', name: 'Marathi', nativeName: 'मराठी' },
  { code: 'gu', name: 'Gujarati', nativeName: 'ગુજરાતી' },
  { code: 'kn', name: 'Kannada', nativeName: 'ಕನ್ನಡ' },
  { code: 'ml', name: 'Malayalam', nativeName: 'മലയാളം' },
  { code: 'pa', name: 'Punjabi', nativeName: 'ਪੰਜਾਬੀ' },
  { code: 'or', name: 'Odia', nativeName: 'ଓଡ଼ିଆ' },
  { code: 'ur', name: 'Urdu', nativeName: 'اردو' },
];
