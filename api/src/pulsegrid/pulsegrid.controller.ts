import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { PulseGridService } from './pulsegrid.service';

@Controller('api')
export class PulseGridController {
  constructor(private readonly pulseGridService: PulseGridService) {}

  @Get('health')
  health() {
    return {
      status: 'ok',
      service: 'pulsegrid-mfe-graphql-gateway',
      timestamp: new Date().toISOString(),
      queueMetrics: this.pulseGridService.getQueueMetrics(),
    };
  }

  @Get('federation/manifest')
  getManifest(@Query('role') role = 'STAFF_ARCHITECT') {
    return {
      hostVersion: '22.2.4',
      zonelessSignals: true,
      role,
      remotes: this.pulseGridService.getFederationManifest(role),
    };
  }

  @Post('notifications/burst')
  triggerBurst(
    @Body()
    body: {
      burstSize?: number;
      scenario?: string;
    },
  ) {
    return this.pulseGridService.dispatchStormBurst(
      body?.burstSize ?? 50,
      body?.scenario ?? 'DUPLICATE_STORM',
    );
  }
}
