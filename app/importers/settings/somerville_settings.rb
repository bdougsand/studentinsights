class Settings::SomervilleSettings

  def initialize(options = {})
    @school_scope = options[:school_scope]
    @first_time = options[:first_time]
    @recent_only = options[:recent_only]
  end

  def options
    {
      school_scope: @school_scope,
      recent_only: @recent_only,
      first_time: @first_time,
    }
  end

  def x2_sftp_credentials
    {
      user: ENV['SIS_SFTP_USER'],
      host: ENV['SIS_SFTP_HOST'],
      key_data: ENV['SIS_SFTP_KEY']
    }
  end

  def x2_options
    options.merge({
      client: SftpClient.new(credentials: x2_sftp_credentials),
      data_transformer: CsvTransformer.new
    })
  end

  def star_sftp_credentials
    {
      user: ENV['STAR_SFTP_USER'],
      host: ENV['STAR_SFTP_HOST'],
      password: ENV['STAR_SFTP_PASSWORD']
    }
  end

  def star_options
    options.merge({ client: SftpClient.new(credentials: star_sftp_credentials) })
  end

  def configuration
    importers = [
      StudentsImporter.new(x2_options),
      StudentAssessmentImporter.new(x2_options),
      StarReadingImporter.new(star_options),
      StarReadingImporter::HistoricalImporter.new(star_options),
      StarMathImporter.new(star_options),
      StarMathImporter::HistoricalImporter.new(star_options),
      BehaviorImporter.new(x2_options),
      HealeyAfterSchoolTutoringImporter.new,   # Currently local import only
      EducatorsImporter.new(x2_options),
    ]

    if @first_time
      importers << BulkAttendanceImporter.new(options)
    else
      importers << AttendanceImporter.new(options)
    end

    importers
  end

end
