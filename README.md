Chrome extension to auto-parse profiles in OkCupid and Bumble, identifying those
that are trite, terse or both. Profile that fail to meet requirements are
automatically passed (_i.e._, left-swiped), although profiles that meet certain
geographic criteria are preferred despite profile text content.

This is a prototype, and thus a complete hack. The plan is now to rewrite the
entire extension in ElixirScript, leveraging functional programming to manage
control flow and injected state.
