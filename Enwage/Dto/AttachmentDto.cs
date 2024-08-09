namespace Enwage.Dto
{
    public class AttachmentDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = null!;
        public long Size { get; set; }
        public string Type { get; set; } = null!;
        public int EmployeeId { get; set; }

        public string BaseCode { get; set; } = null!;  // Base64 string

        public byte[] GetBasecodeAsBytes()
        {
            return Convert.FromBase64String(BaseCode);
        }
    }
}
