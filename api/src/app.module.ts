import { Global, Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { PulseGridService } from './pulsegrid/pulsegrid.service';
import { PulseGridResolver } from './pulsegrid/pulsegrid.resolver';
import { PulseGridController } from './pulsegrid/pulsegrid.controller';

@Global()
@Module({
  providers: [PulseGridService],
  exports: [PulseGridService],
})
export class PulseGridCoreModule {}

@Module({
  imports: [
    PulseGridCoreModule,
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: true,
      sortSchema: true,
      playground: true,
      introspection: true,
    }),
  ],
  controllers: [PulseGridController],
  providers: [PulseGridResolver],
})
export class AppModule {}
