// Re-export constants from server election data for client use
// (static data only — no server-side secrets)
export {
  ELECTION_TIMELINE,
  QUIZ_QUESTIONS,
  SUGGESTED_PROMPTS,
  PROCESS_TOPICS,
  SUPPORTED_LANGUAGES,
} from '../../server/electionData.js';
