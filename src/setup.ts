import { setupServer } from './setupServer/setupServer';
import { connectToDB } from './data-source';

export async function setup() {
  await connectToDB();
  await setupServer();
}
