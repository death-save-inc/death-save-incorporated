export const INITIAL_CASH = 16

export const MARKETS = [
  ['nl', 'AEX',         '577.11',    '+0.33', 1],
  ['eu', 'EURO 50',     '3,576.59',  '+0.57', 0],
  ['us', 'US SPX 500',  '2,975.51',  '+0.31', 0],
  ['us', 'US NDAQ 100', '7,865.76',  '+0.29', 0],
  ['de', 'Germany 30',  '12,536.40', '+0.39', 0],
  ['gb', 'UK 100',      '7,196.00',  '-0.24', 0],
  ['es', 'Spain 35',    '9,294.71',  '+0.52', 0],
  ['fr', 'CAC 40',      '5,674.15',  '+0.55', 0],
  ['it', 'Italy 40',    '22,220.80', '+0.79', 0],
  ['us', 'US 30',       '26,867.90', '+0.30', 1],
]

export const INITIAL_NEWS = [
  ['13:25', 'BlackRock acquires the concept of sleep, begins charging rent'],
  ['13:23', 'UnitedHealth denies claim citing patient’s will to live'],
  ['13:18', 'JPMorgan monetizes grief, revenue beats estimates'],
  ['13:04', 'Wells Fargo repossesses customers’ remaining memories'],
  ['12:52', 'ASML ships machine that prints debt directly onto workers'],
  ['12:40', 'Shell discovers oil beneath the last public park'],
]

export const NEWS_SUBJECTS = [
  'BlackRock', 'UnitedHealth', 'JPMorgan', 'Wells Fargo', 'ASML', 'Shell',
  'Nestlé', 'Amazon', 'Pfizer', 'ExxonMobil', 'Meta', 'Goldman Sachs',
  'Tesla', 'Comcast', 'Halliburton', 'Raytheon', 'Visa', 'Oracle',
  'Chevron', 'Walmart', 'PepsiCo', 'Boeing', 'Lockheed', 'Nvidia', 'Disney',
]

export const NEWS_TEMPLATES = [
  s => `${s} acquires the concept of sleep, begins charging rent`,
  s => `${s} denies claim citing patient’s will to live`,
  s => `${s} monetizes grief, revenue beats estimates`,
  s => `${s} repossesses customers’ remaining memories`,
  s => `${s} ships machine that prints debt onto newborns`,
  s => `${s} discovers oil beneath the last public park`,
  s => `${s} patents breathable air, premium tier launches Q3`,
  s => `${s} lays off humans, retains their productivity metrics`,
  s => `${s} introduces subscription for owning your own name`,
  s => `${s} buys the rain, drought reclassified as churn`,
  s => `${s} offers immortality, terms hidden behind paywall`,
  s => `${s} reports record profit as last forest is liquidated`,
  s => `${s} replaces minimum wage with loyalty points`,
  s => `${s} files to trademark the color of the sky`,
  s => `${s} converts childhood nostalgia into a tradable asset`,
  s => `${s} announces hostile takeover of the afterlife`,
  s => `${s} bills survivors for the privilege of remembering`,
  s => `${s} automates empathy, then deprecates it for cost`,
  s => `${s} seizes pension fund to finance executive cryo-pods`,
  s => `${s} rebrands poverty as an exclusive austerity experience`,
  s => `${s} installs ads on the inside of workers’ eyelids`,
  s => `${s} acquires the moon, parking fees effective immediately`,
  s => `${s} launches tier where heartbeat requires active license`,
  s => `${s} settles lawsuit by purchasing the courthouse`,
  s => `${s} replaces funerals with a freemium mourning app`,
  s => `${s} taxes daydreaming, citing lost output`,
  s => `${s} buys the horizon, sunsets now pay-per-view`,
  s => `${s} merges with rival, layoffs reach the board itself`,
  s => `${s} converts hospitals into high-yield data centers`,
  s => `${s} sells naming rights to the common cold`,
  s => `${s} repackages clean water as a limited collector’s edition`,
  s => `${s} mandates overtime in employees’ dreams`,
  s => `${s} forecloses on a city, residents billed for eviction`,
  s => `${s} introduces premium queue for accessing oxygen`,
  s => `${s} liquidates wildlife to unlock shareholder value`,
  s => `${s} patents the act of grieving, royalties due monthly`,
  s => `${s} replaces sunlight with sponsored holograms`,
  s => `${s} charges interest on unpaid emotional labor`,
  s => `${s} buys the ocean, declares tides a paid feature`,
  s => `${s} unveils chip that bills you for forgetting an ad`,
  s => `${s} outsources conscience to lowest bidder`,
  s => `${s} reclassifies retirement as unauthorized idle time`,
  s => `${s} acquires gravity, weightlessness now enterprise-only`,
  s => `${s} turns public libraries into surge-priced lounges`,
  s => `${s} bills the unemployed for the cost of their hope`,
  s => `${s} announces buyback funded by selling the future`,
  s => `${s} licenses the alphabet, vowels cost extra`,
  s => `${s} replaces democracy with a loyalty rewards program`,
  s => `${s} monetizes silence, then bans it for non-subscribers`,
  s => `${s} harvests dreams, quarterly yield exceeds guidance`,
]

export const PROJ_HORIZONS = ['next quarter', 'FY27', 'H1 ’27', 'the next 18 months', 'EOY', 'rolling 12mo']

export const PROJ_DRIVERS = [
  'retention up', 'viral coefficient climbing', 'margins widening', 'churn defeated',
  'install base compounding', 'competitor in retreat', 'word-of-mouth flywheel spinning',
]

export const PROJ_MODES = ['conservative', 'base case', 'aggressive', 'internal', 'street consensus', 'board-blessed']
