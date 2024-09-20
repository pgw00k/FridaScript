class Il2cppUtils
{
    static ReadIL2CPPString(pointer) {
        let size = pointer.add('0x10').readU32();
        let strRaw = pointer.add('0x14').readUtf16String();
        return strRaw;
    }
}