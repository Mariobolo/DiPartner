package com.dipartner.desktop.database;

import android.content.ContentValues;
import android.content.Context;
import android.database.Cursor;
import android.database.sqlite.SQLiteDatabase;
import android.database.sqlite.SQLiteOpenHelper;
import android.util.Log;

import java.util.HashMap;
import java.util.Map;

public class DisplaySettingsDatabaseHelper extends SQLiteOpenHelper {
    private static final String TAG = "DisplaySettingsDB";
    private static final String DATABASE_NAME = "display_settings.db";
    private static final int DATABASE_VERSION = 1;
    
    public static final String TABLE_SETTINGS = "settings";
    
    public static final String COLUMN_ID = "_id";
    public static final String COLUMN_DISPLAY_SCALE = "display_scale";
    
    private static final String CREATE_TABLE_SETTINGS = 
            "CREATE TABLE " + TABLE_SETTINGS + " (" +
            COLUMN_ID + " INTEGER PRIMARY KEY AUTOINCREMENT, " +
            COLUMN_DISPLAY_SCALE + " REAL NOT NULL DEFAULT 1.0);";
    
    private static DisplaySettingsDatabaseHelper instance;
    
    private DisplaySettingsDatabaseHelper(Context context) {
        super(context, DATABASE_NAME, null, DATABASE_VERSION);
    }
    
    public static synchronized DisplaySettingsDatabaseHelper getInstance(Context context) {
        if (instance == null) {
            instance = new DisplaySettingsDatabaseHelper(context.getApplicationContext());
        }
        return instance;
    }
    
    @Override
    public void onCreate(SQLiteDatabase db) {
        db.execSQL(CREATE_TABLE_SETTINGS);
        Log.d(TAG, "显示设置数据库表创建成功");
        
        ContentValues values = new ContentValues();
        values.put(COLUMN_DISPLAY_SCALE, 1.0);
        db.insert(TABLE_SETTINGS, null, values);
    }
    
    @Override
    public void onUpgrade(SQLiteDatabase db, int oldVersion, int newVersion) {
        // 暂时无需升级
    }
    
    public Map<String, Object> getAllSettings() {
        Map<String, Object> settings = new HashMap<>();
        SQLiteDatabase db = this.getReadableDatabase();
        Cursor cursor = db.query(TABLE_SETTINGS, null, null, null, null, null, null);
        
        if (cursor.moveToFirst()) {
            settings.put("display_scale", cursor.getDouble(cursor.getColumnIndexOrThrow(COLUMN_DISPLAY_SCALE)));
        } else {
            settings.put("display_scale", 1.0);
        }
        
        cursor.close();
        db.close();
        return settings;
    }
    
    public void updateDisplayScale(double scale) {
        SQLiteDatabase db = this.getWritableDatabase();
        ContentValues values = new ContentValues();
        values.put(COLUMN_DISPLAY_SCALE, scale);
        db.update(TABLE_SETTINGS, values, null, null);
        db.close();
        Log.d(TAG, "更新显示缩放设置: " + scale);
    }
    
    public double getDisplayScale() {
        SQLiteDatabase db = this.getReadableDatabase();
        Cursor cursor = db.query(TABLE_SETTINGS, null, null, null, null, null, null);
        double scale = 1.0;
        
        if (cursor.moveToFirst()) {
            scale = cursor.getDouble(cursor.getColumnIndexOrThrow(COLUMN_DISPLAY_SCALE));
        }
        
        cursor.close();
        db.close();
        return scale;
    }
}
