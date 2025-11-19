import { ModuleRegistry } from 'ag-grid-community';
import { AllCommunityModule } from 'ag-grid-community';

export function registerAGGridModules() {
  ModuleRegistry.registerModules([AllCommunityModule]);
}
