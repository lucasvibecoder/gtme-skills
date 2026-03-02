const fs = require('fs');
const path = require('path');

const CATEGORIES = {
  'gtm-context': 'Foundation',
  'email-writer': 'Outbound & Email',
  'text-trainer': 'Voice & Writing',
  'prospect-finder': 'Prospecting',
  'web-scraping': 'Data Extraction',
};

const SKILLS_DIR = path.join(__dirname, '..', '..', 'skills');
const README_PATH = path.join(__dirname, '..', '..', 'README.md');
const MARKETPLACE_PATH = path.join(__dirname, '..', '..', '.claude-plugin', 'marketplace.json');

function parseFrontmatter(content) {
  const lines = content.split('\n');
  if (lines[0].trim() !== '---') return {};

  const fm = {};
  for (let i = 1; i < lines.length; i++) {
    if (lines[i].trim() === '---') break;
    const match = lines[i].match(/^(\w[\w.]*)\s*:\s*(.+)$/);
    if (match) {
      const key = match[1].trim();
      let value = match[2].trim();
      // Strip surrounding quotes
      if ((value.startsWith('"') && value.endsWith('"')) ||
          (value.startsWith("'") && value.endsWith("'"))) {
        value = value.slice(1, -1);
      }
      // Support nested keys like metadata.version
      if (key.includes('.')) {
        const parts = key.split('.');
        if (!fm[parts[0]]) fm[parts[0]] = {};
        fm[parts[0]][parts[1]] = value;
      } else {
        fm[key] = value;
      }
    }
    // Handle indented metadata block
    if (lines[i].trim() === 'metadata:') {
      for (let j = i + 1; j < lines.length; j++) {
        if (lines[j].trim() === '---') break;
        if (!lines[j].startsWith('  ')) break;
        const subMatch = lines[j].trim().match(/^(\w+)\s*:\s*(.+)$/);
        if (subMatch) {
          if (!fm.metadata) fm.metadata = {};
          let val = subMatch[2].trim();
          if ((val.startsWith('"') && val.endsWith('"')) ||
              (val.startsWith("'") && val.endsWith("'"))) {
            val = val.slice(1, -1);
          }
          fm.metadata[subMatch[1]] = val;
        }
      }
    }
  }
  return fm;
}

function getSkills() {
  const skills = [];
  const dirs = fs.readdirSync(SKILLS_DIR, { withFileTypes: true })
    .filter(d => d.isDirectory())
    .map(d => d.name)
    .sort();

  for (const dir of dirs) {
    const skillFile = path.join(SKILLS_DIR, dir, 'SKILL.md');
    if (!fs.existsSync(skillFile)) continue;

    const content = fs.readFileSync(skillFile, 'utf-8');
    const fm = parseFrontmatter(content);
    const version = (fm.metadata && fm.metadata.version) || '1.0.0';

    skills.push({
      name: fm.name || dir,
      dirName: dir,
      path: `skills/${dir}/SKILL.md`,
      category: CATEGORIES[dir] || 'Other',
      version,
      description: fm.description || '',
    });
  }
  return skills;
}

function updateReadme(skills) {
  if (!fs.existsSync(README_PATH)) {
    console.log('README.md not found, skipping table update');
    return;
  }

  const readme = fs.readFileSync(README_PATH, 'utf-8');
  const startMarker = '<!-- SKILLS:START -->';
  const endMarker = '<!-- SKILLS:END -->';

  const startIdx = readme.indexOf(startMarker);
  const endIdx = readme.indexOf(endMarker);
  if (startIdx === -1 || endIdx === -1) {
    console.log('Skills markers not found in README.md, skipping');
    return;
  }

  const rows = skills.map(s =>
    `| [${s.name}](${s.path}) | ${s.category} | ${s.version} | ${s.description} |`
  );

  const table = [
    '| Skill | Category | Version | Description |',
    '|-------|----------|---------|-------------|',
    ...rows,
  ].join('\n');

  const updated = readme.slice(0, startIdx + startMarker.length) +
    '\n' + table + '\n' +
    readme.slice(endIdx);

  fs.writeFileSync(README_PATH, updated);
  console.log(`Updated README.md with ${skills.length} skills`);
}

function updateMarketplace(skills) {
  const marketplace = fs.existsSync(MARKETPLACE_PATH)
    ? JSON.parse(fs.readFileSync(MARKETPLACE_PATH, 'utf-8'))
    : {};

  marketplace.skills = skills.map(s => ({
    name: s.dirName,
    path: s.path,
    category: s.category,
    version: s.version,
    description: s.description,
  }));

  fs.writeFileSync(MARKETPLACE_PATH, JSON.stringify(marketplace, null, 2) + '\n');
  console.log(`Updated marketplace.json with ${skills.length} skills`);
}

const skills = getSkills();
updateReadme(skills);
updateMarketplace(skills);
