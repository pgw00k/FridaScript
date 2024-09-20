class FileUtils
{
	static SaveFile(filePath,data)
	{
		var f = new File(filePath,"wb+")
		f.write(data);
		f.flush();
		f.close();
	}
}

