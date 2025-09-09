

class DataTypeEnum {
    constructor()
    {
        this.INT8    = 0x0001;
        this.UINT8   = 0x0002;
        this.INT16   = 0x0003;
        this.UINT16  = 0x0004;
        this.INT32   = 0x0005;
        this.UINT32  = 0x0006;
        this.INT64   = 0x0007;
        this.UINT64  = 0x0008;
        this.FLOAT32 = 0x0009;
        this.FLOAT64 = 0x000A;

        this.CHAR    = this.INT8;
        this.FLOAT   = this.FLOAT32;
        this.DOUBLE  = this.FLOAT64;
    }
}

const DataTypeId = new DataTypeEnum();
export { DataTypeId };


