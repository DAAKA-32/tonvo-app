# Anthropic Skills Inventory — for Tonvo Meta Ads campaign team

Verified May 2026 against live GitHub READMEs.

## Repo: anthropics/skills
URL: https://github.com/anthropics/skills — official Anthropic repo. Distributed via plugin marketplace (no git clone needed).

### Available skills (path: `skills/<slug>/SKILL.md`)

| Slug | One-liner | Match for user request |
|---|---|---|
| skill-creator | Meta-skill: create, edit, eval, and benchmark Claude skills. | EXACT match for "skill-creator" |
| webapp-testing | Playwright-based toolkit for testing local web apps, screenshots, console logs. | EXACT match for "web-app-testing" |
| mcp-builder | Guide for building MCP servers in Python (FastMCP) or TS (MCP SDK). | Closest match for "mcp-server" |
| frontend-design | Production-grade frontend interfaces, avoids generic AI aesthetics. | Closest match for "design-claude-skills" |
| canvas-design | HTML5 canvas-based generative design. | secondary design candidate |
| brand-guidelines | Apply brand systems consistently. | n/a |
| theme-factory | Generate cohesive UI themes/tokens. | n/a |
| algorithmic-art | Generative art skill. | n/a |
| claude-api | Build Anthropic SDK apps with prompt caching. | n/a |
| doc-coauthoring | Co-author long-form docs. | n/a |
| docx / pdf / pptx / xlsx | Office document creation/editing. | n/a |
| internal-comms | Draft internal communications. | n/a |
| slack-gif-creator | Slack reaction GIFs. | n/a |
| web-artifacts-builder | Self-contained interactive web artifacts. | n/a |

Frontmatter only declares `name` + `description` — no `allowed-tools` field is set on these (Claude infers tools).

## Repo: obra/superpowers
URL: https://github.com/obra/superpowers — Jesse Vincent. Plugin install (no manual clone).

### Available skills (path: `skills/<slug>/SKILL.md`)

| Slug | One-liner | Match for user request |
|---|---|---|
| using-superpowers | Entry point that wires the others together. | EXACT match for "superpowers" |
| writing-skills | Framework for authoring new skills (parallel to skill-creator). | secondary match for "design-claude-skills" |
| brainstorming | Socratic design refinement via dialogue. | n/a |
| writing-plans | Create implementation plans with 2–5 min tasks. | n/a |
| executing-plans | Batch execute plans with human checkpoints. | n/a |
| dispatching-parallel-agents | Concurrent subagent workflows. | n/a |
| subagent-driven-development | Two-stage subagent review. | n/a |
| test-driven-development | RED-GREEN-REFACTOR cycle. | n/a |
| systematic-debugging | 4-phase root-cause analysis. | n/a |
| verification-before-completion | Confirms fixes actually work. | closest match for "self-healing" (recovery loop) |
| requesting-code-review / receiving-code-review | PR review workflow pair. | n/a |
| using-git-worktrees | Parallel branches. | n/a |
| finishing-a-development-branch | Merge/PR decision flow. | n/a |

NOT present in obra/superpowers: `self-healing`, `researcher`, `design-claude-skills`, `web-app-testing`, `mcp-server`, `skill-creator`.

## Other repos found
- `Shmayro/singularity-claude` — true self-evolving/self-repairing skill engine (closest to literal "self-healing").
- `pandnyr/self-healing-claude` — error-capture + memory loop.
- `jiji262/claude-design-skill` — single design skill adapted from Claude.ai's internal design prompt.
- `travisvn/awesome-claude-skills`, `ComposioHQ/awesome-claude-skills`, `rohitg00/awesome-claude-code-toolkit` — curated indexes (browse, don't install wholesale).
- No "researcher" skill exists in either main repo. Closest analogue is the `brainstorming` skill (obra) for exploration.

## Install commands

Run these inside Claude Code (they target `.claude/plugins/`, not `.claude/skills/`):

```
# Anthropic official skills (skill-creator, webapp-testing, mcp-builder, frontend-design)
/plugin marketplace add anthropics/skills
/plugin install example-skills@anthropic-agent-skills
/plugin install document-skills@anthropic-agent-skills

# Superpowers (one-shot, official marketplace already wired)
/plugin install superpowers@claude-plugins-official

# Self-healing community skill (manual)
git clone https://github.com/Shmayro/singularity-claude "c:\Users\emili\OneDrive\Documents\M1001\Code\Cue app\.claude\skills\singularity"
```

For ad-hoc single skills, copy the folder directly:
```
git clone https://github.com/anthropics/skills /tmp/anth
cp -r /tmp/anth/skills/skill-creator ".claude/skills/"
```

## Recommendation for the marketing team

Install for the Meta Ads workflow:
1. `superpowers` (obra) — `brainstorming` + `writing-plans` directly improve ad-concept ideation and campaign briefs.
2. `skill-creator` (anthropic) — author Tonvo-specific skills (e.g. an `ad-copy-tonvo` skill encoding our hooks/CTAs).
3. `frontend-design` (anthropic) — landing-page polish for ad-destination URLs.
4. `webapp-testing` (anthropic) — verify ad landing pages render correctly pre-launch.

Skip for marketing (pure dev tooling):
- `mcp-builder`, `test-driven-development`, `systematic-debugging`, `using-git-worktrees`, `subagent-driven-development`, `claude-api`, `singularity-claude` (self-healing).

A literal `researcher` skill does not exist; for ad-research workflows use `brainstorming` (obra) plus the `WebSearch` tool natively.
