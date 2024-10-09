import { BadRequestException, Injectable } from '@nestjs/common'
import { createClient } from '@supabase/supabase-js'

@Injectable()
export class SupabaseConfigService {
  constructor() {
    this.init()
  }

  get supabaseUrl() {
    return process.env.SUPABASE_URL
  }

  get supabaseKey() {
    return process.env.SUPABASE_KEY
  }

  async init() {
    const supabaseUrl = process.env.SUPABASE_URL
    const supabaseKey = process.env.SUPABASE_KEY
    const supabase = createClient(supabaseUrl, supabaseKey, {
      auth: {
        persistSession: false,
      },
    })
    return supabase
  }

  async uploadFile(file: Express.Multer.File) {
    const supabase = await this.init()

    const date = new Date().getTime()
    const fileName = date + file.originalname
    const { data, error } = await supabase.storage.from('upload').upload(fileName, file.buffer, {
      upsert: false,
    })

    if (error) {
      throw new BadRequestException('Error uploading file: ' + error.message)
    }

    return data
  }

  async createSignedUrl(fileName: string, expiration: number): Promise<string> {
    const supabase = await this.init()
    const { data, error } = await supabase.storage.from('upload').createSignedUrl(fileName, expiration)

    if (error) {
      throw new BadRequestException('Error uploading file: ' + error.message)
    }

    return data.signedUrl
  }

  async deleteFile(fileName: string) {
    const supabase = await this.init()

    const { data, error } = await supabase.storage.from('upload').remove([fileName])

    if (error) {
      throw new BadRequestException('Error uploading file: ' + error.message)
    }

    return data
  }

  // list all files in bucket
  async listFiles() {
    const supabase = await this.init()
    const { data, error } = await supabase.storage.from('upload').list('', {
      limit: 100,
      offset: 0,
      sortBy: { column: 'name', order: 'asc' },
    })

    if (error) {
      throw new BadRequestException('Error uploading file: ' + error.message)
    }

    return data
  }
}
