import { Injectable, Logger } from '@nestjs/common';
import { promises as fs } from 'fs';
import { join } from 'path';

@Injectable()
export class BannerService {
  private readonly logger = new Logger(BannerService.name);
  private readonly dataPath = join(process.cwd(), 'backend', 'data');
  private readonly filePath = join(this.dataPath, 'banner.json');

  async getBanner(): Promise<{ url: string | null }> {
    try {
      await fs.mkdir(this.dataPath, { recursive: true });
      const exists = await fs.stat(this.filePath).then(() => true).catch(() => false);
      if (!exists) return { url: null };
      const raw = await fs.readFile(this.filePath, 'utf8');
      const parsed = JSON.parse(raw || '{}');
      return { url: parsed.url ?? null };
    } catch (e) {
      this.logger.error('Error leyendo banner', e as any);
      return { url: null };
    }
  }

  async setBanner(url: string | null): Promise<{ url: string | null }> {
    try {
      await fs.mkdir(this.dataPath, { recursive: true });
      if (url == null || url === '') {
        // remove file if exists
        await fs.writeFile(this.filePath, JSON.stringify({ url: null }), 'utf8');
        return { url: null };
      }
      await fs.writeFile(this.filePath, JSON.stringify({ url }), 'utf8');
      return { url };
    } catch (e) {
      this.logger.error('Error guardando banner', e as any);
      return { url: null };
    }
  }
}
