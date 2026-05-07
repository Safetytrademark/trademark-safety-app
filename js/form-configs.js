const PROJECTS = [
  'Office',
  '19TM019 - Metro Can - Centra',
  '23TM001 - Syncra - Richards and Drake',
  '23TM007 - Axiom - Woodland Park Ph2',
  '23TM009 - Axiom Builders - 1515 Alberni',
  '24TM002 - Axiom Builder - The Brentwood 5 & 6',
  '24TM010 - Axiom - 145 East Columbia St',
  '25TM001 - Axiom - Brentwood - T7',
  '25TM004 - Axiom - IPL 33',
  '25TM006 - Bonnis - 4635 Arbutus',
  '25TM007 - Wesgroup - Willingdon Phase 1 and 2',
  '25TM009 - Axiom - Brentwood Mall Phase 3',
  '25TM010 - Caliber - Firehall',
  '25TM011 - ETRO - 6362 Fraser St',
  '26TM001 - Smith Bros - Langley Smith Athletic Park',
  '26TM002 - Smith Bros - Marpole Transit Center'
];

// ── FOREMAN → PROJECT MAPPING ─────────────────────────────────────────────────
// Match is by FIRST NAME only, case-insensitive (e.g. "Mike Radu" → matches 'Mike').
// If the name does not match anyone below, only "Office" is shown.
// 'Office' is always added automatically — do NOT list it here.
const FOREMAN_PROJECTS = {
  'Elson': [
    '23TM009 - Axiom Builders - 1515 Alberni',
    '25TM004 - Axiom - IPL 33',
    '24TM010 - Axiom - 145 East Columbia St',
    '25TM011 - ETRO - 6362 Fraser St',
    '23TM007 - Axiom - Woodland Park Ph2'
  ],
  'Dan': [
    '23TM009 - Axiom Builders - 1515 Alberni',
    '25TM004 - Axiom - IPL 33',
    '24TM010 - Axiom - 145 East Columbia St',
    '25TM011 - ETRO - 6362 Fraser St',
    '23TM007 - Axiom - Woodland Park Ph2'
  ],
  'Dez': [
    '23TM009 - Axiom Builders - 1515 Alberni',
    '25TM004 - Axiom - IPL 33',
    '24TM010 - Axiom - 145 East Columbia St',
    '25TM011 - ETRO - 6362 Fraser St',
    '23TM007 - Axiom - Woodland Park Ph2'
  ],
  'Steve': [
    '19TM019 - Metro Can - Centra',
    '23TM001 - Syncra - Richards and Drake',
    '24TM010 - Axiom - 145 East Columbia St',
    '26TM001 - Smith Bros - Langley Smith Athletic Park'
  ],
  'Sam': [
    '24TM002 - Axiom Builder - The Brentwood 5 & 6',
    '25TM001 - Axiom - Brentwood - T7',
    '25TM007 - Wesgroup - Willingdon Phase 1 and 2',
    '26TM002 - Smith Bros - Marpole Transit Center'
  ],
  'Mike': [
    '24TM002 - Axiom Builder - The Brentwood 5 & 6',
    '25TM001 - Axiom - Brentwood - T7',
    '25TM009 - Axiom - Brentwood Mall Phase 3'
  ],
  'Ramon': [
    '23TM007 - Axiom - Woodland Park Ph2',
    '23TM009 - Axiom Builders - 1515 Alberni',
    '24TM002 - Axiom Builder - The Brentwood 5 & 6',
    '24TM010 - Axiom - 145 East Columbia St',
    '25TM001 - Axiom - Brentwood - T7',
    '25TM004 - Axiom - IPL 33',
    '25TM006 - Bonnis - 4635 Arbutus',
    '25TM007 - Wesgroup - Willingdon Phase 1 and 2',
    '25TM009 - Axiom - Brentwood Mall Phase 3',
    '25TM010 - Caliber - Firehall',
    '25TM011 - ETRO - 6362 Fraser St',
    '26TM001 - Smith Bros - Langley Smith Athletic Park',
    '26TM002 - Smith Bros - Marpole Transit Center'
  ],
  'Trademark': [
    '23TM007 - Axiom - Woodland Park Ph2',
    '23TM009 - Axiom Builders - 1515 Alberni',
    '24TM002 - Axiom Builder - The Brentwood 5 & 6',
    '24TM010 - Axiom - 145 East Columbia St',
    '25TM001 - Axiom - Brentwood - T7',
    '25TM004 - Axiom - IPL 33',
    '25TM006 - Bonnis - 4635 Arbutus',
    '25TM007 - Wesgroup - Willingdon Phase 1 and 2',
    '25TM009 - Axiom - Brentwood Mall Phase 3',
    '25TM010 - Caliber - Firehall',
    '25TM011 - ETRO - 6362 Fraser St',
    '26TM001 - Smith Bros - Langley Smith Athletic Park',
    '26TM002 - Smith Bros - Marpole Transit Center'
  ]
};

// ── Helper: get projects visible to a given foreman name ─────────────────────
function getProjectsForForeman(name) {
  const OFFICE_ONLY = ['Office'];
  if (!name) return OFFICE_ONLY;

  const firstName = name.trim().toLowerCase().split(/\s+/)[0];

  for (const [key, projects] of Object.entries(FOREMAN_PROJECTS)) {
    if (firstName === key.toLowerCase()) {
      // Always prepend Office so they can send office photos too
      return ['Office', ...projects];
    }
  }

  // Name not recognised → Office only
  return OFFICE_ONLY;
}

const SUBMISSION_TYPES = [
  { id: 'Daily Tailgate',              icon: '☀️',  desc: 'Morning safety meeting' },
  { id: 'Weekly Toolbox Talk',         icon: '🗣️',  desc: 'Weekly safety topic discussion' },
  { id: 'Incident Report',             icon: '🚨',  desc: 'Injury or near miss' },
  { id: 'Telehandler Inspection',      icon: '🏗️',  desc: 'Pre-use telehandler checklist' },
  { id: 'Forklift Inspection',         icon: '🚜',  desc: 'Pre-use forklift checklist' },
  { id: 'E-Pallet Jack Inspection',    icon: '🔋',  desc: 'Electric pallet jack checklist' },
  { id: 'Scaffolding Inspection',      icon: '🪜',  desc: 'Scaffold safety checklist' },
  { id: 'QAQC - Foreman',              icon: '✅',  desc: 'Quality assurance check' },
  { id: 'Site Photos Only',            icon: '📷',  desc: 'Progress or documentation' },
  { id: 'Weekly Timesheet',            icon: '🕐',  desc: 'Weekly hours submission' },
  { id: 'Production Report',           icon: '🧱',  desc: 'Weekly block placement report' },
  { id: 'Hazard Observation',          icon: '⚠️',  desc: 'Unsafe condition found' }
];

const TYPE_TO_FOLDER = {
  'Daily Tailgate':            'Daily Tailgates',
  'Weekly Toolbox Talk':       'Toolbox Talks',
  'Incident Report':           'Incident Reports',
  'Telehandler Inspection':    'Equipment Inspections',
  'Forklift Inspection':       'Equipment Inspections',
  'E-Pallet Jack Inspection':  'Equipment Inspections',
  'Scaffolding Inspection':    'Scaffolding Inspections',
  'QAQC - Foreman':            'QAQC',
  'Site Photos Only':          'Site Photos',
  'Weekly Timesheet':          'Timesheets',
  'Production Report':         'Production Reports',
  'Hazard Observation':        'Hazard Observations'
};

// ── TAILGATE ITEMS REVIEWED ───────────────────────────────────────────────────
const TAILGATE_ITEMS = {
  'Permits & PPE': [
    'Hot Work Permit',
    'Confined Space Entry',
    'Lock Out / Tag Out',
    'Task-Appropriate Gloves',
    'Eye Protection (safety glasses)',
    'Respirator / Dust Mask',
    'Hard Hat & Safety Boots'
  ],
  'Work Surfaces & Equipment': [
    'Uneven or Slippery Surfaces',
    'Mobile Equipment in Area',
    'Spotters Required',
    'Telehandler / Forklift Inspected',
    'Ladders in Use & Secured',
    'Material Storage & Securement',
    'Scaffold Inspected & Tagged'
  ],
  'Masonry & Site Conditions': [
    'Silica / Dust Exposure (cutting)',
    'Mortar / Grout Handling',
    'Sharp Edges on Block / Steel',
    'Overhead Hazards',
    'Adverse Weather Conditions',
    'Housekeeping Maintained'
  ],
  'Fall Protection': [
    'Guardrails in Place',
    'Toe Boards in Place',
    'Full Body Harness Required',
    'Lanyard / Retractable',
    'Daily Inspections',
    'Fall Restraint System'
  ]
};

// ── DEFAULT FLRA TASKS (pre-filled common masonry activities) ─────────────────
const DEFAULT_FLRA_TASKS = [
  {
    task: 'Lay and pack block and mortar',
    hazards: ['Working with Hand Tools', 'Slips / Trips Possible', 'Pinch Points'],
    riskLevel: 'Low',
    controls: 'Proper lifting techniques, team lift for heavy units, back support'
  },
  {
    task: 'Mix mortar and concrete',
    hazards: ['Exposure to Dust', 'Working with Hand Tools'],
    riskLevel: 'Low',
    controls: 'Dust mask, containment tent, proper lifting techniques'
  },
  {
    task: 'Cut blocks',
    hazards: ['Working with Power Tools', 'Exposure to Dust'],
    riskLevel: 'Low',
    controls: 'Water suppression, safety glasses, ear protection, dust mask'
  },
  {
    task: 'Drill dowels',
    hazards: ['Working with Power Tools', 'Exposure to Dust'],
    riskLevel: 'Low',
    controls: 'Dust collection tool attached, safety glasses, hearing protection'
  }
];

// ── FLRA HAZARDS LIST ─────────────────────────────────────────────────────────
const FLRA_HAZARDS = [
  'Others Working Above / Below',
  'Working with Power Tools',
  'Working with Hand Tools',
  'Exposure to Heat / Cold',
  'Use of Scaffolds',
  'Operating Equipment',
  'Slips / Trips Possible',
  'Exposure to Dust',
  'Fall from Heights',
  'Weather Conditions',
  'Pinch Points',
  'Working in Tight Spaces',
  'Other'
];

// ── INSPECTION CONFIGS ────────────────────────────────────────────────────────
const INSP_DAYS = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

const INSPECTION_CONFIGS = {
  'Telehandler Inspection': {
    subtitle: 'Telehandler — Daily Inspection Checklist',
    notice: 'In accordance with WorkSafeBC OHS Regulation Part 16 — Mobile Equipment',
    footerNote: 'Form must be completed prior to start of shift. Keep on-site for review. Report any defects to the site supervisor immediately.',
    signOffLabel: 'Competent Person Sign-Off',
    sections: {
      'Engine & Fluids': [
        'Fluid levels — engine oil, hydraulic fluid, coolant',
        'Check for any visible leaks (oil, hydraulic, fuel)',
        'Fuel level sufficient for shift'
      ],
      'Tires & Undercarriage': [
        'Tires — pressure and condition (no cuts, bulges, or damage)',
        'Wheels and wheel nuts secure'
      ],
      'Boom & Forks / Attachments': [
        'Forks / attachments secure and not cracked or bent',
        'Boom function — lift, extend, retract smoothly',
        'Hydraulic lines — no leaks, cracks, or abrasion',
        'Carriage and tilt function operating correctly'
      ],
      'Controls & Safety Devices': [
        'Brakes and steering functioning correctly',
        'Lights, horn, and backup alarm operational',
        'Seatbelt in good condition and operational',
        'All safety decals visible and legible',
        'Fire extinguisher present, charged, and in date',
        'Emergency stop / shutdown function tested'
      ],
      'General Condition': [
        'Any visible structural damage or cracks',
        'Cab and controls — clean and free of obstructions',
        'No unauthorized modifications to machine'
      ]
    }
  },

  'Forklift Inspection': {
    subtitle: 'Forklift — Daily Inspection Checklist',
    notice: 'In accordance with WorkSafeBC OHS Regulation Part 16 — Mobile Equipment',
    footerNote: 'Form must be completed prior to start of shift. Keep on-site for review. Report any defects to the site supervisor immediately.',
    signOffLabel: 'Competent Person Sign-Off',
    sections: {
      'Engine & Fluids': [
        'Fluid levels — engine oil, hydraulic fluid, coolant',
        'Check for any visible leaks (oil, hydraulic, fuel)',
        'Fuel level sufficient for shift'
      ],
      'Tires & Undercarriage': [
        'Tires — pressure and condition (no cuts, bulges, or damage)',
        'Wheels and wheel nuts secure'
      ],
      'Forks & Mast': [
        'Forks — condition, no cracks, bends, or wear',
        'Mast — lift, tilt, and side-shift operate smoothly',
        'Hydraulic lines — no leaks, cracks, or abrasion',
        'Carriage and attachments secure'
      ],
      'Controls & Safety Devices': [
        'Brakes (service and parking) functioning correctly',
        'Steering functioning correctly',
        'Lights, horn, and backup alarm operational',
        'Seatbelt / operator restraint in good condition',
        'All safety decals visible and legible',
        'Fire extinguisher present, charged, and in date',
        'Emergency stop / shutdown function tested'
      ],
      'General Condition': [
        'Any visible structural damage or cracks',
        'Cab and controls — clean and free of obstructions',
        'No unauthorized modifications to machine'
      ]
    }
  },


  'E-Pallet Jack Inspection': {
    subtitle: 'Electric Pallet Jack — Daily Safety Checklist',
    notice: 'Operator must complete this checklist before starting the machine each day.',
    footerNote: 'Report any problems identified in the daily check to the site supervisor and/or office immediately.',
    signOffLabel: 'Inspected and Signed By',
    sections: {
      'Physical Checks': [
        'Inspect for any visible damage or wear',
        'Check for leaks (hydraulic fluid, etc.)',
        'Ensure forks are straight and not bent',
        'Check for any cracks or structural damage',
        'Inspect wheels — check for foreign objects stuck in wheels',
        'Verify battery charge level',
        'Check battery terminals for corrosion',
        'Inspect battery for signs of swelling or damage'
      ],
      'Controls & Safety Devices': [
        'Ensure all controls are functional (lift, lower, forward, reverse)',
        'Test the functionality of the brakes',
        'Test emergency stop button',
        'Check for working horn and lights',
        'Ensure all safety decals are visible and legible',
        'Verify operational labels are in place'
      ],
      'Operational Checks': [
        'Review starting and stopping procedures',
        'Discuss the importance of slow, controlled movements',
        'Discuss the maximum load capacity of the pallet jack',
        'Explain proper weight distribution on the forks',
        'Review procedures for operating on different surfaces',
        'Discuss safe practices in different weather conditions'
      ],
      'Safety & PPE': [
        'Verify operator is wearing required PPE',
        'Review emergency and malfunction procedures',
        'Discuss strategies for maneuvering in confined areas',
        'Discuss awareness of surroundings to avoid collisions',
        'Train crew on correct way to lift and lower loads',
        'Keep load low for stability during travel'
      ]
    }
  },

  'Scaffolding Inspection': {
    subtitle: 'Scaffolding — Daily Inspection Checklist',
    notice: 'In accordance with WorkSafeBC OHS Regulation Part 13 — Scaffolds & Temporary Work Platforms',
    footerNote: 'Form must be completed prior to start of shift. Keep on-site for review. Report any defects to the site supervisor immediately.',
    signOffLabel: 'Competent Person Sign-Off',
    sections: {
      'Structure & Stability': [
        'Overall scaffold condition and stability',
        'Base supports (mud sills, base plates) properly placed and secure',
        'Uprights and frames plumb, undamaged, and secure',
        'Cross-bracing and connections intact and correctly installed'
      ],
      'Platforms & Access': [
        'Scaffold platforms / planks sound, secured, and of sufficient width',
        'Work platform fully decked — no gaps',
        'Access ladders / stairways secured, in good condition, and unobstructed'
      ],
      'Fall Protection': [
        'Guardrails, midrails, and toe boards installed and secure',
        'Fall protection in place where required (harnesses, tie-offs)',
        'No proximity hazards (electrical lines, overhead hazards)'
      ],
      'Load & Environmental Conditions': [
        'Scaffold not overloaded — material storage within safe load capacity',
        'Weather conditions checked (wind, ice, rain, slippery surfaces)'
      ],
      'Tagging System': [
        'Tag visible, accurate, and up to date for this scaffold'
      ]
    }
  },

  'Forklift Inspection': {
    subtitle: 'Telehandler / Forklift — Daily Inspection Checklist',
    notice: 'In accordance with WorkSafeBC OHS Regulation Part 16 — Mobile Equipment',
    footerNote: 'Form must be completed prior to start of shift. Keep on-site for review. Report any defects to the site supervisor immediately.',
    signOffLabel: 'Competent Person Sign-Off',
    sections: {
      'Engine & Fluids': [
        'Fluid levels — engine oil, hydraulic fluid, coolant',
        'Check for any visible leaks (oil, hydraulic, fuel)',
        'Fuel level sufficient for shift'
      ],
      'Tires & Undercarriage': [
        'Tires — pressure and condition (no cuts, bulges, or damage)',
        'Wheels and wheel nuts secure'
      ],
      'Boom & Forks / Attachments': [
        'Forks / attachments secure and not cracked or bent',
        'Boom function — lift, extend, retract smoothly',
        'Hydraulic lines — no leaks, cracks, or abrasion',
        'Carriage and tilt function operating correctly'
      ],
      'Controls & Safety Devices': [
        'Brakes and steering functioning correctly',
        'Lights, horn, and backup alarm operational',
        'Seatbelt in good condition and operational',
        'All safety decals visible and legible',
        'Fire extinguisher present, charged, and in date',
        'Emergency stop / shutdown function tested'
      ],
      'General Condition': [
        'Any visible structural damage or cracks',
        'Cab and controls — clean and free of obstructions',
        'No unauthorized modifications to machine'
      ]
    }
  }
};

// ── QAQC INSPECTION ITEMS ─────────────────────────────────────────────────────
const QAQC_ITEMS = [
  'CMU units free of cracks, chips, or damaged blocks',
  'Wall plumb, level, and true to line',
  'Joint thickness consistent and fully tooled',
  'Surface / base of wall clean, scrapped — no mortar smears, stains, or efflorescence',
  'Bond pattern as per drawings',
  'Openings (doors / frames) plumb, square, correctly sized and installation',
  'Bondbeams in place and properly installed',
  'Control joints located and built as per specifications',
  'Wall-Lok installed',
  'Firestopping completed and area is cleaned',
  'Horizontal reinforcement correctly installed',
  'Vertical reinforcement and lateral support correctly installed',
  'Doors and windows frames cleaned',
  'Electrical boxes patched straight',
  'Area clean — debris and mortar droppings swept'
];

// ── CLOSE OUT QUESTIONS ───────────────────────────────────────────────────────
const CLOSEOUT_QUESTIONS = [
  'Were there any incidents to report?',
  'Was anyone injured today?',
  'Waste containers sealed, labeled and dated?',
  'Tools / equipment removed from task location?'
];

// ── FORM FIELDS ───────────────────────────────────────────────────────────────
const FORM_FIELDS = {
  'Daily Tailgate': [
    { id: 'work_scope',        label: 'Daily Work Scope',                   type: 'textarea', placeholder: 'Describe today\'s work scope...', required: true },
    { id: 'project_concerns',  label: 'Project Concerns and Controls',      type: 'textarea', placeholder: 'e.g. Road closed, critical lift...' },
    { id: 'items_reviewed',    label: 'Items Reviewed',                     type: 'tailgate-items' },
    { id: 'flra',              label: 'Field Level Risk Assessment',        type: 'flra-table' },
    { id: 'crew',              label: 'Crew Sign-In',                       type: 'crew-signin' },
    { id: 'supervisor_name',   label: 'Supervisor Name',                    type: 'text', placeholder: 'Print full name', required: true },
    { id: 'signature',         label: 'Supervisor Sign Off',                type: 'signature' }
  ],

  'Safety Inspection': [
    { id: 'inspection_area',   label: 'Inspection Area / Location',         type: 'text', placeholder: 'e.g. Level 3 North Side', required: true },
    { id: 'items_inspected',   label: 'Items Inspected',                    type: 'checkbox-group',
      options: ['PPE Availability & Use','Fall Protection Installed','Housekeeping','Equipment Condition','Electrical Safety','Fire Extinguishers','First Aid Kit','Emergency Exits Clear','Signage in Place','Scaffolding / Shoring','Tool Condition','Chemical Storage'] },
    { id: 'deficiencies',      label: 'Deficiencies Found',                 type: 'textarea', placeholder: 'List any issues or non-conformances...' },
    { id: 'corrective_actions',label: 'Corrective Actions',                 type: 'textarea', placeholder: 'Actions taken or planned...' },
    { id: 're_inspection_date',label: 'Re-Inspection Date (if required)',   type: 'date' },
    { id: 'supervisor_name',   label: 'Supervisor Name',                    type: 'text', placeholder: 'Print full name', required: true },
    { id: 'signature',         label: 'Supervisor Sign Off',                type: 'signature' }
  ],

  'Weekly Toolbox Talk': [
    { id: 'topic',             label: 'Talk Topic / Title',                 type: 'text', placeholder: 'e.g. Working at Heights', required: true },
    { id: 'key_points',        label: 'Key Points Discussed',               type: 'textarea', placeholder: 'Summarize the main safety points covered...' },
    { id: 'hazards',           label: 'Specific Hazards Discussed',         type: 'textarea', placeholder: 'Hazards relevant to this topic...' },
    { id: 'questions_raised',  label: 'Questions / Concerns Raised',        type: 'textarea', placeholder: 'Any questions or concerns from the crew...' },
    { id: 'crew',              label: 'Crew Sign-In',                       type: 'crew-signin' },
    { id: 'supervisor_name',   label: 'Supervisor Name',                    type: 'text', placeholder: 'Print full name', required: true },
    { id: 'signature',         label: 'Supervisor Sign Off',                type: 'signature' }
  ],

  'Incident Report': [
    { id: 'injured_person',    label: "Injured / Affected Person's Name",   type: 'text', placeholder: 'Full name', required: true },
    { id: 'incident_time',     label: 'Time of Incident',                   type: 'time', required: true },
    { id: 'incident_location', label: 'Location of Incident',               type: 'text', placeholder: 'Exact location on site', required: true },
    { id: 'description',       label: 'Description of What Happened',       type: 'textarea', placeholder: 'Describe the sequence of events...', required: true },
    { id: 'injury_type',       label: 'Type of Injury / Incident',          type: 'radio',
      options: ['Cut / Laceration','Bruise / Contusion','Sprain / Strain','Fracture','Eye Injury','Burn','Near Miss (No Injury)','Property Damage Only','Other'], required: true },
    { id: 'body_part',         label: 'Body Part Affected',                 type: 'text', placeholder: 'e.g. Left hand, lower back' },
    { id: 'medical_treatment', label: 'Medical Treatment Required',         type: 'radio',
      options: ['None','First Aid on Site','Clinic Visit','Emergency Room','Hospitalization'], required: true },
    { id: 'witnesses',         label: 'Witness Names',                      type: 'textarea', placeholder: 'Names of witnesses...' },
    { id: 'root_cause',        label: 'Root Cause / Contributing Factors',  type: 'textarea', placeholder: 'What led to this incident?' },
    { id: 'preventive_measures',label:'Preventive Measures',                type: 'textarea', placeholder: 'Steps to prevent recurrence...' },
    { id: 'supervisor_name',   label: 'Supervisor Name',                    type: 'text', placeholder: 'Print full name', required: true },
    { id: 'signature',         label: 'Supervisor Sign Off',                type: 'signature' }
  ],

  'Hazard Observation': [
    { id: 'hazard_location',   label: 'Hazard Location',                    type: 'text', placeholder: 'Where on site?', required: true },
    { id: 'hazard_description',label: 'Hazard Description',                 type: 'textarea', placeholder: 'Describe the unsafe condition...', required: true },
    { id: 'risk_level',        label: 'Risk Level',                         type: 'radio',
      options: ['Low — Monitor only','Medium — Address within 24hrs','High — Fix before work continues','Critical — Stop work immediately'], required: true },
    { id: 'immediate_action',  label: 'Immediate Action Taken',             type: 'textarea', placeholder: 'What was done right away?' },
    { id: 'follow_up_required',label: 'Follow-Up Required?',                type: 'radio', options: ['Yes','No'], required: true },
    { id: 'follow_up_details', label: 'Follow-Up Details',                  type: 'textarea', placeholder: 'Who, what, and by when?' },
    { id: 'supervisor_name',   label: 'Supervisor Name',                    type: 'text', placeholder: 'Print full name', required: true },
    { id: 'signature',         label: 'Sign Off',                           type: 'signature' }
  ],

  'Site Photos Only': [
    { id: 'description',       label: 'Description / Purpose of Photos',    type: 'textarea', placeholder: 'What are these photos documenting?', required: true },
    { id: 'area',              label: 'Area / Section of Site',             type: 'text', placeholder: 'Which area is shown?' },
    { id: 'supervisor_name',   label: 'Submitted By',                       type: 'text', placeholder: 'Print full name', required: true },
    { id: 'signature',         label: 'Sign Off',                           type: 'signature' }
  ],

  'Production Report': [
    { id: 'week_of',         label: 'Week Of',                type: 'date', required: true },
    { id: 'location',        label: 'Job / Location / Area',  type: 'text', placeholder: 'e.g. Langley Smith Athletic Park — Level 3' },
    { id: 'gc',              label: 'General Contractor',     type: 'text', placeholder: 'e.g. Smith Bros Woodbridge' },
    { id: 'production',      label: 'Block Placement & Crew', type: 'production-table' },
    { id: 'delays',          label: 'Delays / Issues',        type: 'textarea', placeholder: 'Brief note on anything that impacted production...' },
    { id: 'supervisor_name', label: 'Foreman Name',           type: 'text', placeholder: 'Print full name', required: true },
    { id: 'signature',       label: 'Foreman Sign Off',       type: 'signature' }
  ],

  'Telehandler Inspection': [
    { id: 'machine_unit',        label: 'Machine / Unit #',       type: 'text', placeholder: 'e.g. TH-01', required: true },
    { id: 'operator',            label: 'Operator Name',           type: 'text', placeholder: 'Operator name', required: true },
    { id: 'checklist',           label: 'Daily Inspection',        type: 'daily-inspection' },
    { id: 'final_determination', label: 'Final Determination',     type: 'radio',
      options: ['Machine is SAFE for use as per today\'s inspection', 'Machine REQUIRES REPAIR before use — do not operate'], required: true },
    { id: 'add_comments',        label: 'Additional Comments',     type: 'textarea', placeholder: 'Any additional notes or deficiencies found...' },
    { id: 'supervisor_name',     label: 'Competent Person Name',   type: 'text', placeholder: 'Print full name', required: true },
    { id: 'signature',           label: 'Competent Person Sign Off', type: 'signature' }
  ],

  'Forklift Inspection': [
    { id: 'machine_unit',        label: 'Machine / Unit #',       type: 'text', placeholder: 'e.g. FK-01', required: true },
    { id: 'operator',            label: 'Operator Name',           type: 'text', placeholder: 'Operator name', required: true },
    { id: 'checklist',           label: 'Daily Inspection',        type: 'daily-inspection' },
    { id: 'final_determination', label: 'Final Determination',     type: 'radio',
      options: ['Machine is SAFE for use as per today\'s inspection', 'Machine REQUIRES REPAIR before use — do not operate'], required: true },
    { id: 'add_comments',        label: 'Additional Comments',     type: 'textarea', placeholder: 'Any additional notes or deficiencies found...' },
    { id: 'supervisor_name',     label: 'Competent Person Name',   type: 'text', placeholder: 'Print full name', required: true },
    { id: 'signature',           label: 'Competent Person Sign Off', type: 'signature' }
  ],

  'E-Pallet Jack Inspection': [
    { id: 'machine_unit',    label: 'Machine / Unit #',       type: 'text', placeholder: 'e.g. EPJ-01', required: true },
    { id: 'operator',        label: 'Operator Name',           type: 'text', placeholder: 'Operator name', required: true },
    { id: 'checklist',       label: 'Daily Safety Checklist',  type: 'daily-inspection' },
    { id: 'add_comments',    label: 'Comments',                type: 'textarea', placeholder: 'Report any problems identified to the site supervisor immediately...' },
    { id: 'supervisor_name', label: 'Printed Name',            type: 'text', placeholder: 'Print full name', required: true },
    { id: 'signature',       label: 'Operator Sign Off',       type: 'signature' }
  ],

  'Scaffolding Inspection': [
    { id: 'scaffold_location',   label: 'Scaffold Location',       type: 'text', placeholder: 'e.g. Level 3 North Wall', required: true },
    { id: 'inspector',           label: 'Inspector Name',           type: 'text', placeholder: 'Inspector name', required: true },
    { id: 'checklist',           label: 'Daily Inspection Items',   type: 'daily-inspection' },
    { id: 'tag_status',          label: 'Scaffold Tag Status',      type: 'radio',
      options: ['🟢 GREEN — Scaffold is SAFE for use', '🟡 YELLOW — CAUTION: limited use, mitigations in place', '🔴 RED — DO NOT USE: scaffold is unsafe'],
      required: true },
    { id: 'final_determination', label: 'Final Determination',      type: 'radio',
      options: ['Scaffold is SAFE for use as per today\'s inspection', 'Scaffold REQUIRES REPAIR before use — do not use'],
      required: true },
    { id: 'add_comments',        label: 'Additional Comments',      type: 'textarea', placeholder: 'Any additional notes or corrective actions...' },
    { id: 'supervisor_name',     label: 'Competent Person Name',    type: 'text', placeholder: 'Print full name', required: true },
    { id: 'signature',           label: 'Competent Person Sign Off', type: 'signature' }
  ],

  'QAQC - Foreman': [
    { id: 'project_number',    label: 'Project #',                          type: 'text',     placeholder: 'e.g. 25TM010' },
    { id: 'location_area',     label: 'Location / Area',                    type: 'text',     placeholder: 'e.g. Level 3 — North Wall', required: true },
    { id: 'floor_room',        label: 'Floor / Room',                       type: 'text',     placeholder: 'e.g. Floor 4, Room 402' },
    { id: 'drawing_ref',       label: 'Drawing Ref #',                      type: 'text',     placeholder: 'e.g. A-201 Rev 3' },
    { id: 'gc',                label: 'General Contractor',                 type: 'text',     placeholder: 'e.g. Smith Bros Woodbridge' },
    { id: 'work_description',  label: 'Work Description',                   type: 'textarea', placeholder: 'Brief description of the completed scope...' },
    { id: 'checklist',         label: 'Inspection Items',                   type: 'qaqc-table' },
    { id: 'overall_result',    label: 'Overall Result',                     type: 'radio',
      options: ['ALL ITEMS PASS — AREA ACCEPTED', 'HOLD — ITEMS REQUIRE CORRECTION BEFORE ACCEPTANCE'], required: true },
    { id: 'supervisor_name',   label: 'Foreman / Inspector Name',           type: 'text',     placeholder: 'Print full name', required: true },
    { id: 'signature',         label: 'Masonry Contractor Sign Off',        type: 'signature' },
    { id: 'gc_name',           label: 'GC Site Representative Name',        type: 'text',     placeholder: 'GC printed name (signs on paper)' }
  ],

  'Weekly Timesheet': [
    { id: 'week_ending',     label: 'Week Ending (date)',    type: 'date', required: true },
    { id: 'location',        label: 'Job / Location / Area', type: 'text', placeholder: 'e.g. Langley Smith Athletic Park — Level 3' },
    { id: 'timesheet',       label: 'Employee Hours',        type: 'timesheet-table' },
    { id: 'supervisor_name', label: 'Foreman Name',          type: 'text', placeholder: 'Print full name', required: true },
    { id: 'signature',       label: 'Foreman Sign Off',      type: 'signature' }
  ]
};
