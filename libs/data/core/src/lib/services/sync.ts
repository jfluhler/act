import { inject, autoInjectable } from 'tsyringe';
import { ActContext } from '../context';
import { schemaAndMigrations } from '../schema';
import { synchronize } from '@nozbe/watermelondb/sync';

@autoInjectable()
export class SyncService {
  constructor(@inject('ActContext') private _context?: ActContext) {}

  sync = async () => {
    await synchronize({
      database: this._context.get(),
      pullChanges: async ({
        lastPulledAt,
        schemaVersion,
        migration
      }) => {
        const urlParams = `last_pulled_at=${lastPulledAt}&schema_version=${schemaVersion}&migration=${encodeURIComponent(
          JSON.stringify(migration)
        )}&tables=${JSON.stringify(
          Object.keys(schemaAndMigrations.schema.tables)
        )}`;
        const response = await fetch(
          `http://localhost:3333/api/sync?${urlParams}`
        );
        if (!response.ok) {
          throw new Error(await response.text());
        }

        const { changes, timestamp } = await response.json();
        return { changes, timestamp };
      },
      pushChanges: async ({ changes, lastPulledAt }) => {
        const response = await fetch(
          `http://localhost:3333/api/sync?last_pulled_at=${lastPulledAt}`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(changes)
          }
        );
        if (!response.ok) {
          throw new Error(await response.text());
        }
      },
      migrationsEnabledAtVersion: 1
    });
  };
}