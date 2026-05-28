import { SweetsController } from '../controllers/sweetsController';
import { SweetModel } from '../models/Sweet';

jest.mock('../models/Sweet');

const mockRes = () => {
  const res: any = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn();
  return res;
};

describe('SweetsController (UNIT TEST)', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('create → should create a sweet', async () => {
    const req: any = {
      body: {
        name: 'Ladoo',
        price: 30,
        quantity: 100
      }
    };

    const res = mockRes();

    (SweetModel.create as jest.Mock).mockResolvedValue(req.body);

    await SweetsController.create(req, res);

    expect(SweetModel.create).toHaveBeenCalledWith(req.body);
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(req.body);
  });
});


