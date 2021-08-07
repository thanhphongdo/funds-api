// Define Cloud Functions
import('./functions/post').then(c => new c.PostFunction());
import('./functions/user').then(c => new c.UserFunction());
import('./functions/transaction').then(c => new c.TransactionFunction());
import('./functions/event').then(c => new c.EventFunction());

// Define Triggers
import('./triggers/post').then(c => new c.PostTrigger());
import('./triggers/transaction').then(c => new c.TransactionTrigger());

// Define Jobs
import('./jobs/post').then(c => new c.PostJob());

// Define Live Queries