import { ApiProperty } from '@nestjs/swagger';

export class CommonResponseDto<T> {
  @ApiProperty({ example: 'success', description: 'Response status' })
  status: string;

  @ApiProperty({ example: 'Operation successful', description: 'Response message' })
  message: string;

  @ApiProperty({ description: 'Response data', type: Object }) // Adjust type if needed
  data: T;

  @ApiProperty({ example: 200, description: 'HTTP status code' })
  statusCode: number;

  constructor(status: string, message: string, data: T, statusCode: number) {
    this.status = status;
    this.message = message;
    this.data = data;
    this.statusCode = statusCode;
  }
}
