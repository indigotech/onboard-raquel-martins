import { setupServer } from './setup-server/setup-server';
import { connectToDB } from './data-source';

export async function setup() {
  await connectToDB();
  await setupServer();
}
