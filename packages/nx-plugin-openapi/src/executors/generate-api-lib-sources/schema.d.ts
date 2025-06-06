export interface GenerateApiLibSourcesExecutorSchema {
  generator: string;
  sourceSpecPathOrUrl: string;
  useDockerBuild?: boolean;
  sourceSpecUrlAuthorizationHeaders?: string;
  additionalProperties?: string;
  globalProperties?: string;
  typeMappings?: string;
  silent?: boolean;
  ignoreList?: string[];
}
