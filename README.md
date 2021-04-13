This script makes all your lodash imports modular.

For example:

```
import { get } from 'lodash'
get({ "cat": "dog"}, "cat")
```

Would be:

```
import sortBy from 'lodash/get'
get( "cat", { "cat": "dog"})
```

Setup & Run

```
npm install -g jscodeshift
git clone https://github.com/swist/jscodeshift-to-lodash-fp.git
jscodeshift -t jscodeshift-to-lodash-fp/replace-with-lodash-fp-imports.js <your-project-dir>
jscodeshift -t jscodeshift-to-lodash-fp/reorder-lodash-fp-args.js <your-project-dir>
```
