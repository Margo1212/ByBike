﻿import { prismaMock } from '~/common/tests/prisma';
import { request } from '~/common/tests/utils';

const sampleToken =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjoic2FtcGxlLWlkIiwiaWF0IjoxNjUwMDIzNjk2fQ.ckeQDVU0HqNe5CRb56l7FBSOi63t81774fbiRP2BK3U';

describe('Get User handler', () => {
  it('receive response when send request with valid data', async () => {
    prismaMock.user.update.mockResolvedValue({
      id: 'sample-id',
      username: 'Krzysztof',
      nickname: 'Krzychu',
      email: 'krzy@szt.of',
      avatar: 'sample-avatar',
      contractType: 'B2B',
      toWorkDistance: 4,
      isConfigured: false,
    });
    const payload = {
      id: 'sample-id',
      username: 'Krzysztof',
      nickname: 'Krzychu',
      email: 'krzy@szt.of',
      avatar: 'sample-avatar',
      contractType: 'B2B',
      toWorkDistance: 4,
    };
    const response = await request.put('/api/scoring/users').send(payload).set('accessToken', sampleToken);

    expect(response.status).toBe(200);
    expect(response.body.isConfigured).toBeTruthy();
  });

  it('receive 400 code respond when send request with invalid data', async () => {
    prismaMock.user.update.mockResolvedValue({
      id: 'sample-id',
      username: 'username',
      nickname: 'nickname',
      email: 'mateusz.zajac@motorolasolutions.com',
      avatar: 'sample-avatar',
      contractType: 'B2B',
      toWorkDistance: 4,
      isConfigured: false,
    });

    const response = await request.put('/api/scoring/users').set('accessToken', sampleToken).send();

    expect(response.status).toBe(400);
    expect(response.text).toBeTruthy();
  });
});
