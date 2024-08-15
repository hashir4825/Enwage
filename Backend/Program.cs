using Enwage.Dto;
using Enwage.Models;
using Enwage.Properties.Services;
using Enwage.Repository;
using Enwage.UnitofWork;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.



builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.ReferenceHandler = System.Text.Json.Serialization.ReferenceHandler.IgnoreCycles;
    });
builder.Services.AddScoped<IUnitofWork, UnitofWork>();
builder.Services.AddScoped<IEmployeeService, EmployeeService>();
builder.Services.AddScoped<IClientService, ClientServices>();
builder.Services.AddScoped<IStateServices, StateServices>();

// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddAutoMapper(AppDomain.CurrentDomain.GetAssemblies());
builder.Services.AddDbContext<EnwageContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("EnwageDB")));
builder.Services.AddSwaggerGen();

var app = builder.Build();
app.UseCors(options => options.WithOrigins("http://localhost:4200")

.AllowAnyMethod()

.AllowAnyHeader()

);

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();
